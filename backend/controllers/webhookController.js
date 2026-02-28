const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { updateUserSpend } = require('./userController');

// In-memory lock to prevent race conditions from concurrent duplicate webhooks
const processingWebhooks = new Set();

const webhookController = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Determine secret properly
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        // Express raw body is required here
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        console.info(`[WEBHOOK RECEIVED] Successfully verified signature for event type: ${event.type}`);
    } catch (err) {
        console.error(`[WEBHOOK FATAL] Signature verification failed. Error: ${err.message}`);
        // We can safely return a 400 here because if the signature is invalid, it's a hard reject.
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Acknowledge receipt of the event IMMEDIATELY to prevent Stripe CLI from timing out and retrying
    // while we do heavy processing (PDF generation, Emails)
    res.status(200).json({ received: true });

    // Handle the checkout.session.completed event asynchronously
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        // --- RACE CONDITION PREVENTION ---
        // If we are currently processing this exact payment, skip it to prevent double-orders.
        if (processingWebhooks.has(session.payment_intent)) {
            console.warn(`[WEBHOOK WARN] Already processing Payment Intent: ${session.payment_intent}. Ignoring concurrent retry.`);
            return;
        }
        processingWebhooks.add(session.payment_intent);

        console.info(`[WEBHOOK PROCESSING] Handling checkout.session.completed for Payment Intent: ${session.payment_intent}`);

        try {
            // Ensure idempotency (check if order already exists in DB from a past successful run)
            const existingOrder = await Order.findOne({ 'paymentInfo.id': session.payment_intent });
            if (existingOrder) {
                console.warn(`[WEBHOOK WARN] Order already exists in DB for Payment Intent: ${session.payment_intent}. Silently skipping.`);
                return;
            }

            // Parse our injected metadata
            const {
                userId,
                userName,
                userEmail,
                discountAmount,
                couponCode,
                shippingFee,
                itemsPrice,
                taxPrice,
            } = session.metadata;

            // Parse expanded order items from compressed metadata (stringified JSON)
            const compressedItems = JSON.parse(session.metadata.orderItems);

            // Re-hydrate full order items structure directly from MongoDB to bypass Stripe limits
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

            // Shipping address comes exclusively from our CheckoutPage metadata
            // (shipping_address_collection was removed from the Stripe session)
            const shippingAddress = {
                address: session.metadata.shippingLine1 || 'N/A',
                city: session.metadata.shippingCity || 'N/A',
                state: session.metadata.shippingState || 'N/A',
                country: 'AU',
                pinCode: session.metadata.shippingPostalCode || '000000',
                phoneNumber: session.customer_details?.phone || session.metadata.shippingPhone || '0000000000',
            };

            // Stock decrement moved *AFTER* Order creation below to prevent infinite drain on webhook retries!

            // Create the order finally
            const newOrder = await Order.create({
                shippingInfo: shippingAddress,
                orderItems,
                paymentInfo: {
                    id: session.payment_intent,
                    status: 'succeeded'
                },
                itemsPrice: Number(itemsPrice),
                taxPrice: Number(taxPrice),
                shippingPrice: Number(shippingFee),
                totalPrice: session.amount_total / 100, // Stripe stores in cents
                discountAmount: Number(discountAmount || 0),
                couponCode: couponCode || '',
                paidAt: Date.now(),
                user: {
                    name: userName,
                    email: userEmail,
                    userId: userId || ''
                },
            });

            console.info(`[WEBHOOK SUCCESS] Order created successfully in Database. Order ID: ${newOrder._id}`);

            // Decrement Stock SAFELY now that Order is guaranteed to be created
            for (let index = 0; index < orderItems.length; index++) {
                const item = orderItems[index];
                const product = await Product.findById(item.product);
                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save({ validateBeforeSave: false });
                    console.info(`[WEBHOOK STOCK] Decremented ${item.quantity} units for Product: ${product.name}`);
                } else {
                    console.error(`[WEBHOOK INVENTORY ALERT] Not enough stock to decrement for Product ID: ${item.product}. Current Stock: ${product?.stock}, Requested: ${item.quantity}`);
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
                console.info(`[WEBHOOK EMAIL] Order confirmation email with PDF invoice dispatched to ${newOrder.user.email}`);
            } catch (emailError) {
                console.error(`[WEBHOOK EMAIL FATAL] Failed to send order confirmation email to ${newOrder.user.email}. Error: ${emailError.message}`);
            }

        } catch (dbError) {
            console.error(`[WEBHOOK DB FATAL] Failed creating order for Payment Intent ${session.payment_intent}. Error: ${dbError.message}`);
        } finally {
            // Remove from lock after a reasonable time (10 minutes) so memory doesn't leak
            setTimeout(() => processingWebhooks.delete(session.payment_intent), 10 * 60 * 1000);
        }
    }
};

module.exports = webhookController;
