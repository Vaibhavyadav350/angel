const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { updateUserSpend } = require('../controllers/userController');
const pdfService = require('./pdfService');
const { sendOrderConfirmation } = require('../utils/emailService');

/**
 * Shared service for creating an order after successful payment.
 * Used by sowohl webhookController (Redirect) and paymentController (Direct).
 */
exports.createOrderFromTransaction = async (transaction, meta, compressedItems, shippingMeta) => {
    const transactionId = String(transaction.TransactionID);
    
    // Ensure idempotency
    const existingOrder = await Order.findOne({ 'paymentInfo.id': transactionId });
    if (existingOrder) {
        console.warn(`[ORDER SERVICE] Order already exists for TransactionID: ${transactionId}`);
        return existingOrder;
    }

    // Reassemble Metadata from pipe-delimited Options (not JSON — eWAY HTML-encodes special chars)
    try {
        const optionsValues = (transaction.Options || []).map(o => o.Value || '');

        // Parse pipe-delimited meta: uid=xxx|uname=yyy|email=zzz|disc=0|coupon=|shipFee=15|itemsP=700
        if (!meta || Object.keys(meta).length === 0) {
            const metaPairs = {};
            (optionsValues[0] || '').split('|').forEach(pair => {
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
            };
        }

        // Parse compact items: id:qty:color:size,id:qty:color:size
        if (!compressedItems || compressedItems.length === 0) {
            compressedItems = (optionsValues[1] || '').split(',').filter(Boolean).map(entry => {
                const [id, q, c, s] = entry.split(':');
                return { id, q: Number(q) || 1, c: c || 'Standard', s: s || 'M' };
            });
        }

        // Parse pipe-delimited shipping: addr=xxx|city=yyy|state=NSW|zip=2000|phone=04xxx
        if (!shippingMeta || Object.keys(shippingMeta).length === 0) {
            const shipPairs = {};
            (optionsValues[2] || '').split('|').forEach(pair => {
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
            orderItems.push({
                name: product.name,
                price: product.price,
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

    // Create the order
    const newOrder = await Order.create({
        shippingInfo: shippingAddress,
        orderItems,
        paymentInfo: {
            id: transactionId,
            status: 'succeeded'
        },
        itemsPrice: Number(itemsPrice),
        taxPrice: 0,
        shippingPrice: Number(shippingFee),
        totalPrice: transaction.TotalAmount / 100, // eWAY stores in cents
        discountAmount: Number(discountAmount || 0),
        couponCode: couponCode || '',
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
