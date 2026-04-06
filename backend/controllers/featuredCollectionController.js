const FeaturedCollection = require('../models/featuredCollectionModel');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const ErrorHandler = require('../utils/ErrorHandler');

// get active collections by section
exports.getActiveCollections = catchAsyncError(async (req, res, next) => {
    const query = { isActive: true };
    if (req.query.section) {
        query.section = req.query.section;
    }
    const collections = await FeaturedCollection.find(query).sort({ order: 1 });
    res.status(200).json({
        success: true,
        data: collections,
    });
});

// get all collections (admin)
exports.getAllCollections = catchAsyncError(async (req, res, next) => {
    const collections = await FeaturedCollection.find().sort({ order: 1 });
    res.status(200).json({
        success: true,
        data: collections,
    });
});

// create collection (admin)
exports.createCollection = catchAsyncError(async (req, res, next) => {
    const collection = await FeaturedCollection.create(req.body);
    res.status(201).json({
        success: true,
        data: collection,
    });
});

// update collection (admin)
exports.updateCollection = catchAsyncError(async (req, res, next) => {
    const collection = await FeaturedCollection.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });
    if (!collection) {
        return next(new ErrorHandler('Collection not found', 404));
    }
    res.status(200).json({
        success: true,
        data: collection,
    });
});

// delete collection (admin)
exports.deleteCollection = catchAsyncError(async (req, res, next) => {
    const collection = await FeaturedCollection.findByIdAndDelete(req.params.id);
    if (!collection) {
        return next(new ErrorHandler('Collection not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Collection deleted successfully',
    });
});
