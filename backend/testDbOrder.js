require('dotenv').config();
const mongoose = require('mongoose');
const Order = require('./models/orderModel');

const mockSession = {
    metadata: {
        userId: '',
        userName: 'Guest User',
        userEmail: 'guest@example.com',
        discountAmount: '0',
        couponCode: '',
        shippingFee: '0',
        itemsPrice: '250',
        taxPrice: '0',
        orderItems: JSON.stringify([
            {
                id: "65e2361acabaee2fa8ac6677", // Replace with valid from DB or mock mock behavior
                q: 1,
                c: "Standard",
                s: "M"
            }
        ])
    },
    shipping_details: {
        address: {
            line1: "123 Main St",
            city: "London",
            state: null, // intentionally null to simulate UK/international orders without states
            country: "GB",
            postal_code: null // simulating no postal code
        }
    },
    customer_details: {
        phone: null
    },
    payment_intent: "pi_mock_12345",
    amount_total: 25000
};

async function runTest() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const {
            userId, userName, userEmail, discountAmount, couponCode,
            shippingFee, itemsPrice, taxPrice
        } = mockSession.metadata;
        const compressedItems = JSON.parse(mockSession.metadata.orderItems);

        // Re-hydrate full order items structure directly from MongoDB to bypass Stripe limits
        const orderItems = [];
        for (const cItem of compressedItems) {
            const Product = require('./models/productModel');
            const product = await Product.findById(cItem.id);
            if (product) {
                orderItems.push({
                    name: product.name,
                    price: product.price,
                    quantity: cItem.q,
                    image: product.images && product.images[0] ? product.images[0].url : 'default_image.jpg',
                    color: cItem.c,
                    size: cItem.s,
                    product: cItem.id
                });
            }
        }

        const shippingAddress = {
            address: mockSession.shipping_details.address.line1 || 'N/A',
            city: mockSession.shipping_details.address.city || 'N/A',
            state: mockSession.shipping_details.address.state || 'N/A',
            country: mockSession.shipping_details.address.country || 'N/A',
            pinCode: mockSession.shipping_details.address.postal_code || '000000',
            phoneNumber: mockSession.customer_details?.phone || '0000000000',
        };

        const newOrder = new Order({
            shippingInfo: shippingAddress,
            orderItems,
            paymentInfo: {
                id: mockSession.payment_intent,
                status: 'succeeded'
            },
            itemsPrice: Number(itemsPrice),
            taxPrice: Number(taxPrice),
            shippingPrice: Number(shippingFee),
            totalPrice: mockSession.amount_total / 100,
            discountAmount: Number(discountAmount || 0),
            couponCode: couponCode || '',
            paidAt: Date.now(),
            user: {
                name: userName,
                email: userEmail,
                userId: userId || ''
            },
        });

        const error = newOrder.validateSync();
        if (error) {
            console.error("Mongoose Validation Error:", error.message);
        } else {
            console.log("Validation Passed! The code would successfully save to DB.");
        }

    } catch (err) {
        console.error("Exception thrown:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

runTest();
