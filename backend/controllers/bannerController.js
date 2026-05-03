const Banner = require('../models/bannerModel');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

// get all active banners
exports.getActiveBanners = catchAsyncError(async (req, res, next) => {
    const banners = await Banner.find({ isActive: true }).sort({ order: 1 });
    res.status(200).json({
        success: true,
        data: banners,
    });
});

// get all banners (admin)
exports.getAllBanners = catchAsyncError(async (req, res, next) => {
    const banners = await Banner.find().sort({ order: 1 });
    res.status(200).json({
        success: true,
        data: banners,
    });
});

// create banner (admin)
exports.createBanner = catchAsyncError(async (req, res, next) => {
    const banner = await Banner.create(req.body);
    res.status(201).json({
        success: true,
        data: banner,
    });
});

// update banner (admin)
exports.updateBanner = catchAsyncError(async (req, res, next) => {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!banner) {
        return next(new ErrorHandler('Banner not found', 404));
    }
    res.status(200).json({
        success: true,
        data: banner,
    });
});

// delete banner (admin)
exports.deleteBanner = catchAsyncError(async (req, res, next) => {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
        return next(new ErrorHandler('Banner not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Banner deleted successfully',
    });
});
