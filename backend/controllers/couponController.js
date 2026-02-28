const catchAsyncErrors = require('../middleware/CatchAsyncErrors');
const Coupon = require('../models/couponModel');
const ErrorHandler = require('../utils/ErrorHandler');

// Create Coupon
exports.createCoupon = catchAsyncErrors(async (req, res, next) => {
    const coupon = await Coupon.create(req.body);
    res.status(201).json({
        success: true,
        data: coupon
    });
});

// Get All Coupons
exports.getAllCoupons = catchAsyncErrors(async (req, res, next) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: coupons
    });
});

// Delete Coupon
exports.deleteCoupon = catchAsyncErrors(async (req, res, next) => {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return next(new ErrorHandler('Coupon not found', 404));
    await coupon.remove();
    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });
});

// Validate Coupon (For Frontend Checkout)
exports.validateCoupon = catchAsyncErrors(async (req, res, next) => {
    const { code, cartTotal } = req.body;
    const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true });

    if (!coupon) return next(new ErrorHandler('Invalid or inactive coupon', 400));

    if (new Date() > coupon.expiryDate) {
        return next(new ErrorHandler('Coupon has expired', 400));
    }

    if (coupon.usedCount >= coupon.usageLimit) {
        return next(new ErrorHandler('Coupon usage limit reached', 400));
    }

    if (cartTotal < coupon.minPurchase) {
        return next(new ErrorHandler(`Minimum purchase of $${coupon.minPurchase} required`, 400));
    }

    res.status(200).json({
        success: true,
        data: {
            discountType: coupon.discountType,
            amount: coupon.amount,
            code: coupon.code
        }
    });
});
