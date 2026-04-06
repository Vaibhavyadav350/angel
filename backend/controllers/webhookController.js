const rapid = require('eway-rapid');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { updateUserSpend } = require('./userController');

// Initialize eWAY Rapid client
const client = rapid.createClient(
  process.env.EWAY_API_KEY,
  process.env.EWAY_PASSWORD,
  process.env.EWAY_ENDPOINT || 'https://api.sandbox.ewaypayments.com/'
);

// In-memory lock to prevent race conditions from concurrent duplicate callbacks
const processingCallbacks = new Set();

/**
 * eWAY Callback Controller
 * This replaces the old Stripe webhook. After the customer completes payment
 * on eWAY's Responsive Shared Page, eWAY redirects them here with an AccessCode.
 * We verify the transaction, create the order, and redirect to the frontend.
 */
const ewayCallbackController = async (req, res) => {
    const accessCode = req.query.AccessCode;
    const FRONTEND_URL = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',')[0] : 'http://localhost:3000';

    if (!accessCode) {
        console.error('[EWAY CALLBACK FATAL] No AccessCode received in callback.');
        return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
    }

    try {
        // Query eWAY to verify the transaction using the AccessCode
        const result = await client.queryTransaction(accessCode);

        if (!result || !result.Transactions || result.Transactions.length === 0) {
            console.error('[EWAY CALLBACK FATAL] No transaction data returned from eWAY query.');
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        }

        const transaction = result.Transactions[0];
        const transactionId = String(transaction.TransactionID);

        console.info(`[EWAY CALLBACK RECEIVED] TransactionID: ${transactionId}, Status: ${transaction.TransactionStatus}, ResponseCode: ${transaction.ResponseCode}`);

        // Check if payment was successful
        if (!transaction.TransactionStatus || transaction.ResponseCode !== '00') {
            console.error(`[EWAY CALLBACK FAILED] Payment declined. ResponseCode: ${transaction.ResponseCode}, ResponseMessage: ${transaction.ResponseMessage}`);
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        }

        // --- RACE CONDITION PREVENTION ---
        if (processingCallbacks.has(transactionId)) {
            console.warn(`[EWAY CALLBACK WARN] Already processing TransactionID: ${transactionId}. Ignoring concurrent retry.`);
            return res.redirect(`${FRONTEND_URL}/orders?success=true`);
        }
        processingCallbacks.add(transactionId);

        console.info(`[EWAY CALLBACK PROCESSING] Handling successful payment for TransactionID: ${transactionId}`);

        try {
            // Ensure idempotency (check if order already exists in DB)
            const existingOrder = await Order.findOne({ 'paymentInfo.id': transactionId });
            if (existingOrder) {
                console.warn(`[EWAY CALLBACK WARN] Order already exists in DB for TransactionID: ${transactionId}. Redirecting to success.`);
                return res.redirect(`${FRONTEND_URL}/orders?success=true`);
            }

            // Parse metadata from Options fields
            const options = transaction.Options || [];
            const meta = JSON.parse(options[0]?.Value || '{}');
            const compressedItems = JSON.parse(options[1]?.Value || '[]');
            const shippingMeta = JSON.parse(options[2]?.Value || '{}');

            const {
                userId,
                userName,
                userEmail,
                discountAmount,
                couponCode,
                shippingFee,
                itemsPrice,
            } = meta;

            // Re-hydrate full order items structure from MongoDB
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

            // Build shipping address from metadata
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

            console.info(`[EWAY CALLBACK SUCCESS] Order created successfully in Database. Order ID: ${newOrder._id}`);

            // Decrement Stock SAFELY now that Order is guaranteed to be created
            for (let index = 0; index < orderItems.length; index++) {
                const item = orderItems[index];
                const product = await Product.findById(item.product);
                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save({ validateBeforeSave: false });
                    console.info(`[EWAY CALLBACK STOCK] Decremented ${item.quantity} units for Product: ${product.name}`);
                } else {
                    console.error(`[EWAY CALLBACK INVENTORY ALERT] Not enough stock to decrement for Product ID: ${item.product}. Current Stock: ${product?.stock}, Requested: ${item.quantity}`);
                }
            }

            // Update user lifetime spend
            if (userId) {
                await updateUserSpend(userId, newOrder.totalPrice);
            }

            // If coupon used, increment its usage
            if (couponCode) {
                const Coupon = require('../models/couponModel');
                await Coupon.findOneAndUpdate({ code: couponCode }, { $inc: { usedCount: 1 } });
            }

            // Generate PDF and Send Confirmation Email
            try {
                const pdfService = require('../services/pdfService');
                const { sendOrderConfirmation } = require('../utils/emailService');
                const pdfBuffer = await pdfService.generateInvoiceBuffer(newOrder);
                await sendOrderConfirmation(newOrder.user, newOrder, pdfBuffer);
                console.info(`[EWAY CALLBACK EMAIL] Order confirmation email with PDF invoice dispatched to ${newOrder.user.email}`);
            } catch (emailError) {
                console.error(`[EWAY CALLBACK EMAIL FATAL] Failed to send order confirmation email to ${newOrder.user.email}. Error: ${emailError.message}`);
            }

            // Redirect to success page
            return res.redirect(`${FRONTEND_URL}/orders?success=true`);

        } catch (dbError) {
            console.error(`[EWAY CALLBACK DB FATAL] Failed creating order for TransactionID ${transactionId}. Error: ${dbError.message}`);
            return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
        } finally {
            // Remove from lock after a reasonable time (10 minutes) so memory doesn't leak
            setTimeout(() => processingCallbacks.delete(transactionId), 10 * 60 * 1000);
        }
    } catch (error) {
        console.error(`[EWAY CALLBACK FATAL] Transaction query failed. Error: ${error.message}`);
        return res.redirect(`${FRONTEND_URL}/checkout?canceled=true`);
    }
};

module.exports = ewayCallbackController;
