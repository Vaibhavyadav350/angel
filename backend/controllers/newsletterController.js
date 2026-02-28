const Newsletter = require('../models/newsletterModel');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

// Subscribe to newsletter
exports.subscribe = catchAsyncError(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorHandler('Email is required', 400));
    }

    // Check if already subscribed
    const existing = await Newsletter.findOne({ email: email.toLowerCase() });
    if (existing) {
        if (existing.active) {
            return res.status(200).json({
                success: true,
                message: 'You are already subscribed to our archive.',
            });
        }
        // Re-activate if previously unsubscribed
        existing.active = true;
        existing.subscribedAt = Date.now();
        await existing.save();
        console.info(`[NEWSLETTER REACTIVATED] ${email} re-subscribed.`);
        return res.status(200).json({
            success: true,
            message: 'Welcome back to the archive.',
        });
    }

    await Newsletter.create({ email });
    console.info(`[NEWSLETTER NEW SUBSCRIBER] ${email}`);

    res.status(201).json({
        success: true,
        message: 'Successfully subscribed to the archive.',
    });
});

// Admin: Get all subscribers
exports.getAllSubscribers = catchAsyncError(async (req, res, next) => {
    const subscribers = await Newsletter.find().sort({ subscribedAt: -1 });

    res.status(200).json({
        success: true,
        data: subscribers,
    });
});

// Admin: Delete a subscriber
exports.deleteSubscriber = catchAsyncError(async (req, res, next) => {
    const subscriber = await Newsletter.findById(req.params.id);

    if (!subscriber) {
        return next(new ErrorHandler('Subscriber not found', 404));
    }

    console.info(`[NEWSLETTER UNSUBSCRIBED] ${subscriber.email} removed by admin.`);
    await subscriber.remove();

    res.status(200).json({
        success: true,
        message: 'Subscriber deleted successfully',
    });
});
