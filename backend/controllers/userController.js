const UserProfile = require('../models/userProfileModel');
const catchAsyncErrors = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');
const { sendWelcomeEmail } = require('../utils/emailService');

// Get User Profile (Create if doesn't exist)
exports.getUserProfile = catchAsyncErrors(async (req, res, next) => {
    const { userId, email, name } = req.query; // Added name query in case frontend passes it

    if (!userId) return next(new ErrorHandler('User ID is required', 400));

    let profile = await UserProfile.findOne({ userId }).populate('wishlist');

    if (!profile) {
        profile = await UserProfile.create({
            userId,
            email: email || 'unknown'
        });

        // Send welcome email — fire-and-forget so profile creation isn't blocked on SMTP.
        if (email && email !== 'unknown') {
            sendWelcomeEmail({ name: name || 'Valued Client', email })
                .catch((e) => console.error(`[EMAIL FAILED] welcome email to ${email}: ${e.message}`));
        }
    }

    res.status(200).json({
        success: true,
        data: profile
    });
});

// Toggle Wishlist Item
exports.toggleWishlist = catchAsyncErrors(async (req, res, next) => {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
        return next(new ErrorHandler('User ID and Product ID are required', 400));
    }

    let profile = await UserProfile.findOne({ userId });

    if (!profile) {
        profile = await UserProfile.create({ userId, email: req.body.email || 'unknown' });
    }

    const isExist = profile.wishlist.find(id => id.toString() === productId.toString());

    if (isExist) {
        profile.wishlist = profile.wishlist.filter(id => id.toString() !== productId.toString());
    } else {
        profile.wishlist.push(productId);
    }

    await profile.save();

    // Return populated wishlist for frontend state update
    const updatedProfile = await UserProfile.findOne({ userId }).populate('wishlist');

    res.status(200).json({
        success: true,
        wishlist: updatedProfile.wishlist
    });
});

// Update User Spend (Internal use during order placement)
exports.updateUserSpend = async (userId, amount) => {
    try {
        const updatedSpend = await UserProfile.findOneAndUpdate(
            { userId },
            {
                $inc: { totalSpend: amount, orderCount: 1 }
            },
            { new: true, upsert: true }
        );
        console.info(`[USER SPEND TRACK] Added $${amount} to User: ${userId}. New Lifetime Total: $${updatedSpend.totalSpend}`);

        // Potential VIP check logic
        const profile = await UserProfile.findOne({ userId });
        if (profile.totalSpend > 50000 && !profile.isVIP) {
            profile.isVIP = true;
            await profile.save();
            console.info(`[USER VIP UNLOCKED] User ${userId} has surpassed $50,000 in lifetime spend and upgraded to VIP.`);
        }
    } catch (error) {
        console.error('Error updating user spend:', error);
    }
};

// Get All Profiles (Admin)
exports.getAllProfiles = catchAsyncErrors(async (req, res, next) => {
    const profiles = await UserProfile.find().populate('wishlist').sort({ totalSpend: -1 });

    res.status(200).json({
        success: true,
        data: profiles
    });
});
