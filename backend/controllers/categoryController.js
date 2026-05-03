const Category = require('../models/categoryModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');

// Create new category
exports.createCategory = catchAsyncError(async (req, res, next) => {
    const category = await Category.create(req.body);
    res.status(201).json({
        success: true,
        data: category
    });
});

// Get all categories
exports.getAllCategories = catchAsyncError(async (req, res, next) => {
    const categories = await Category.find();
    res.status(200).json({
        success: true,
        data: categories
    });
});

// Get active categories
exports.getActiveCategories = catchAsyncError(async (req, res, next) => {
    const categories = await Category.find({ isActive: true });
    res.status(200).json({
        success: true,
        data: categories
    });
});

// Update category
exports.updateCategory = catchAsyncError(async (req, res, next) => {
    let category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler('Category not found', 404));
    }
    category = await Category.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    res.status(200).json({
        success: true,
        data: category,
    });
});

// Delete category
exports.deleteCategory = catchAsyncError(async (req, res, next) => {
    const category = await Category.findById(req.params.id);
    if (!category) {
        return next(new ErrorHandler('Category not found', 404));
    }
    await category.deleteOne();
    res.status(200).json({
        success: true,
        message: 'Category permanently deleted'
    });
});
