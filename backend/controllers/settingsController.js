const Settings = require('../models/settingsModel');
const catchAsyncError = require('../middleware/CatchAsyncErrors');

// get settings (will return the single settings document, or create it if missing)
exports.getSettings = catchAsyncError(async (req, res, next) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create({});
    }
    res.status(200).json({
        success: true,
        data: settings,
    });
});

// update settings (admin)
exports.updateSettings = catchAsyncError(async (req, res, next) => {
    let settings = await Settings.findOne();
    if (!settings) {
        settings = await Settings.create(req.body);
    } else {
        settings = await Settings.findOneAndUpdate({}, req.body, {
            new: true,
            runValidators: true,
        });
    }
    res.status(200).json({
        success: true,
        data: settings,
    });
});
