const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { updateUserSpend } = require('../controllers/userController');
const pdfService = require('./pdfService');
const { sendOrderConfirmation } = require('../utils/emailService');

/**
 * Creates an order after a confirmed eWAY payment.
 * Called by webhookController (browser redirect callback) and reconciliationService (background recovery).
 */
exports.createOrderFromTransaction = async (transaction, meta, compressedItems, shippingMeta) => {
    const transactionId = String(transaction.TransactionID);

    // Idempotency — unique index on paymentInfo.id also enforces this at DB level
    const existingOrder = await Order.findOne({ 'paymentInfo.id': transactionId });
    if (existingOrder) {
        console.warn(`[ORDER SERVICE] Order already exists for TransactionID: ${transactionId}`);
        return existingOrder;
    }

    // Reassemble metadata from prefixed pipe-delimited Options
    // Format: m:key=val|key=val  i:id:qty:color:size,...  s:key=val|key=val
    // Multiple i: entries are allowed for large carts (eWAY 254 char/entry limit)
    try {
        const optionsValues = (transaction.Options || []).map(o => o.Value || '');

        if (!meta || Object.keys(meta).length === 0) {
            const metaStr = optionsValues.find(v => v.startsWith('m:'))?.slice(2) || '';
            const metaPairs = {};
            metaStr.split('|').forEach(pair => {
                const eqIdx = pair.indexOf('=');
                if (eqIdx > 0) metaPairs[pair.substring(0, eqIdx)] = pair.substring(eqIdx + 1);
            });
            meta = {
                userId: metaPairs.uid || '',
                userName: metaPairs.uname || 'Guest',
                userEmail: metaPairs.email || '',
                discountAmount: Number(metaPairs.disc) || 0,
                couponCode: metaPairs.coupon || '',
                shippingFee: Number(metaPairs.shipFee) || 0,
                itemsPrice: Number(metaPairs.itemsP) || 0,
                addonKeys: metaPairs.addons ? metaPairs.addons.split('.').filter(Boolean) : [],
            };
        }

        if (!compressedItems || compressedItems.length === 0) {
            // Collect all item chunks (may span multiple Options entries)
            const allItemsStr = optionsValues
                .filter(v => v.startsWith('i:'))
                .map(v => v.slice(2))
                .join(',');
            compressedItems = allItemsStr.split(',').filter(Boolean).map(entry => {
                const [id, q, c, s] = entry.split(':');
                return { id, q: Number(q) || 1, c: c || 'Standard', s: s || 'M' };
            });
        }

        if (!shippingMeta || Object.keys(shippingMeta).length === 0) {
            const shipStr = optionsValues.find(v => v.startsWith('s:'))?.slice(2) || '';
            const shipPairs = {};
            shipStr.split('|').forEach(pair => {
                const eqIdx = pair.indexOf('=');
                if (eqIdx > 0) shipPairs[pair.substring(0, eqIdx)] = pair.substring(eqIdx + 1);
            });
            shippingMeta = {
                shippingLine1: shipPairs.addr || '',
                shippingCity: shipPairs.city || '',
                shippingState: shipPairs.state || '',
                shippingPostalCode: shipPairs.zip || '',
                shippingPhone: shipPairs.phone || '',
            };
        }
    } catch (err) {
        console.error(`[ORDER SERVICE FATAL] Metadata Reassembly Failure: ${err.message}`);
    }

    // Ensure we have defaults to avoid destructing errors
    meta = meta || {};
    compressedItems = compressedItems || [];
    shippingMeta = shippingMeta || {};

    const {
        userId,
        userName,
        userEmail,
        discountAmount,
        couponCode,
        shippingFee,
        itemsPrice,
    } = meta;

    // Re-hydrate full order items structure
    const orderItems = [];
    for (const cItem of compressedItems) {
        const product = await Product.findById(cItem.id);
        if (product) {
            // All prices GST-inclusive. `mrp` is the RRP; `price` is what the
            // customer paid after the per-product discount.
            const mrp = Number(product.price) || 0;
            const sellingPrice = Math.round(mrp * (1 - (Number(product.discountPercent) || 0) / 100) * 100) / 100;
            orderItems.push({
                name: product.name,
                price: sellingPrice,
                mrp,
                quantity: cItem.q,
                image: product.images[0]?.url || 'default_image.jpg',
                color: cItem.c,
                size: cItem.s,
                product: cItem.id
            });
        }
    }

    // Build shipping address
    const shippingAddress = {
        address: shippingMeta.shippingLine1 || 'N/A',
        city: shippingMeta.shippingCity || 'N/A',
        state: shippingMeta.shippingState || 'N/A',
        country: 'AU',
        pinCode: shippingMeta.shippingPostalCode || '000000',
        phoneNumber: shippingMeta.shippingPhone || '0000000000',
    };

    // All prices are AUD and GST-inclusive, so the GST is the portion already
    // contained in the total (total / 11 at 10%), not an amount added on top.
    const totalPrice = transaction.TotalAmount / 100; // eWAY stores in cents
    const taxPrice = Math.round((totalPrice / 11) * 100) / 100;

    // Resolve any add-on services (priced from the live settings) for the record.
    const Settings = require('../models/settingsModel');
    const pricingService = require('./pricingService');
    const settingsDoc = (await Settings.findOne()) || {};
    const addOns = pricingService
        .resolveAddons(meta.addonKeys || [], settingsDoc)
        .map((a) => ({ name: a.name, price: a.price }));

    // Create the order
    const newOrder = await Order.create({
        shippingInfo: shippingAddress,
        orderItems,
        paymentInfo: {
            id: transactionId,
            status: 'succeeded'
        },
        itemsPrice: Number(itemsPrice),
        taxPrice,
        shippingPrice: Number(shippingFee),
        totalPrice,
        discountAmount: Number(discountAmount || 0),
        couponCode: couponCode || '',
        addOns,
        paidAt: Date.now(),
        user: {
            name: userName,
            email: userEmail,
            userId: userId || ''
        },
    });

    console.info(`[ORDER SERVICE SUCCESS] Order created: ${newOrder._id}`);

    // Decrement Stock
    for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product && product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save({ validateBeforeSave: false });
            console.info(`[ORDER SERVICE STOCK] Decremented ${item.quantity} for ${product.name}`);
        }
    }

    // Update user spend
    if (userId) {
        await updateUserSpend(userId, newOrder.totalPrice);
    }

    // Update coupon usage
    if (couponCode) {
        const Coupon = require('../models/couponModel');
        await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
    }

    // Send Confirmation Email (non-blocking — fire and forget)
    // Do NOT await this — SMTP timeout was causing 504 Gateway Timeout on DigitalOcean
    pdfService.generateInvoiceBuffer(newOrder)
        .then(pdfBuffer => sendOrderConfirmation(newOrder.user, newOrder, pdfBuffer))
        .catch(emailError => console.error(`[EMAIL FAILED] To: ${newOrder.user?.email || 'unknown'} | Subject: "Order Confirmation - Angel Fashion Studio (#${newOrder._id?.toString().slice(-7).toUpperCase()})" | Error: ${emailError.message}`));

    return newOrder;
};
