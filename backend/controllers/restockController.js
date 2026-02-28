const Restock = require('../models/restockModel');
const Product = require('../models/productModel');
const catchAsyncErrors = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const sendEmail = require('../utils/sendEmail');

// Subscribe to restock alert
exports.subscribeToRestock = catchAsyncErrors(async (req, res, next) => {
    const { productId, email } = req.body;

    if (!productId || !email) {
        return next(new ErrorHandler('Product ID and Email are required', 400));
    }

    // Check if already subscribed
    const existing = await Restock.findOne({ product: productId, email, notified: false });
    if (existing) {
        return res.status(200).json({
            success: true,
            message: 'You are already subscribed for this item.'
        });
    }

    await Restock.create({
        product: productId,
        email
    });

    res.status(201).json({
        success: true,
        message: 'Notification set! We will email you when this heritage item is back.'
    });
});

// Helper to notify subscribers (Called when stock increases)
exports.notifySubscribers = async (productId) => {
    try {
        const product = await Product.findById(productId);
        if (!product || product.stock <= 0) return;

        const subscriptions = await Restock.find({ product: productId, notified: false });

        for (const sub of subscriptions) {
            await sendEmail({
                email: sub.email,
                subject: `Back in Archive: ${product.name}`,
                html: `
                    <div style="font-family: serif; color: #4A3728;">
                        <h1 style="text-transform: uppercase; letter-spacing: 0.2em;">Angel Archive</h1>
                        <p>The heritage artifact you were tracking is now available.</p>
                        <h2 style="font-style: italic;">${product.name}</h2>
                        <p>Price: $${product.price}</p>
                        <br/>
                        <a href="${process.env.FRONTEND_URL}/products/${productId}" style="background: #4A3728; color: #F5F1E6; padding: 12px 24px; text-decoration: none; font-weight: bold; text-transform: uppercase; font-size: 10px; letter-spacing: 0.1em;">View Artifact</a>
                    </div>
                `
            });
            sub.notified = true;
            await sub.save();
        }
        if (subscriptions.length > 0) {
            console.info(`[RESTOCK NOTIFY] Notified ${subscriptions.length} subscriber(s) that '${product.name}' is back in stock.`);
        }
    } catch (error) {
        console.error(`[RESTOCK NOTIFY FAILED] Error notifying subscribers for product ${productId}: ${error.message}`);
    }
};

// Admin alert for low stock
exports.alertAdminLowStock = async (product) => {
    try {
        const admins = await require('../models/adminModel').find({ privilege: 'super' });
        for (const admin of admins) {
            await sendEmail({
                email: admin.email,
                subject: `LOW STOCK ALERT: ${product.name}`,
                text: `Admin Alert: The stock for "${product.name}" (SKU: ${product._id}) has fallen to ${product.stock}. Please consider restocking soon.`
            });
        }
    } catch (error) {
        console.error(`[LOW STOCK ALERT FAILED] Could not email admins about '${product.name}': ${error.message}`);
    }
};
