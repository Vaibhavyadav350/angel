const Testimonial = require('../models/testimonialModel');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

// get featured testimonials
exports.getFeaturedTestimonials = catchAsyncError(async (req, res, next) => {
    const testimonials = await Testimonial.find({ isFeatured: true }).sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: testimonials,
    });
});

// get all testimonials (admin)
exports.getAllTestimonials = catchAsyncError(async (req, res, next) => {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        data: testimonials,
    });
});

// create testimonial (admin)
exports.createTestimonial = catchAsyncError(async (req, res, next) => {
    const testimonial = await Testimonial.create(req.body);
    res.status(201).json({
        success: true,
        data: testimonial,
    });
});

// update testimonial (admin)
exports.updateTestimonial = catchAsyncError(async (req, res, next) => {
    const testimonial = await Testimonial.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!testimonial) {
        return next(new ErrorHandler('Testimonial not found', 404));
    }
    res.status(200).json({
        success: true,
        data: testimonial,
    });
});

// delete testimonial (admin)
exports.deleteTestimonial = catchAsyncError(async (req, res, next) => {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);
    if (!testimonial) {
        return next(new ErrorHandler('Testimonial not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Testimonial deleted successfully',
    });
});
