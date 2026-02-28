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

        // Send welcome email if email is provided
        if (email && email !== 'unknown') {
            await sendWelcomeEmail({ name: name || 'Valued Client', email });
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
        await UserProfile.findOneAndUpdate(
            { userId },
            {
                $inc: { totalSpend: amount, orderCount: 1 }
            },
            { new: true, upsert: true }
        );

        // Potential VIP check logic
        const profile = await UserProfile.findOne({ userId });
        if (profile.totalSpend > 50000 && !profile.isVIP) {
            profile.isVIP = true;
            await profile.save();
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
