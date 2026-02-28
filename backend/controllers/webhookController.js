const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const { updateUserSpend } = require('./userController');

const webhookController = async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        // Determine secret properly
        const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

        // Express raw body is required here
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;

        try {
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

            // Parse order items from metadata (stringified JSON)
            const orderItems = JSON.parse(session.metadata.orderItems);

            // Parse shipping details
            const shippingAddress = {
                address: session.shipping_details.address.line1,
                city: session.shipping_details.address.city,
                state: session.shipping_details.address.state,
                country: session.shipping_details.address.country,
                pinCode: session.shipping_details.address.postal_code,
                phoneNumber: session.customer_details?.phone || '0000000000',
            };

            // Ensure idempotency (check if order already exists with this payment ID)
            const existingOrder = await Order.findOne({ 'paymentInfo.id': session.payment_intent });
            if (existingOrder) {
                return res.status(200).send('Order already exists.');
            }

            // Decrement logic safely inside the webhook
            for (let index = 0; index < orderItems.length; index++) {
                const item = orderItems[index];
                const product = await Product.findById(item.product);
                if (product && product.stock >= item.quantity) {
                    product.stock -= item.quantity;
                    await product.save({ validateBeforeSave: false });
                }
            }

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
            } catch (emailError) {
                console.error(`Failed to send order confirmation email: ${emailError.message}`);
            }

        } catch (dbError) {
            console.error(`DB Error creating order: ${dbError.message}`);
            return res.status(500).send('Internal Server Error');
        }
    }

    // Acknowledge receipt of the event
    res.status(200).json({ received: true });
};

module.exports = webhookController;
