const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: [true, 'Please provide a title for the banner'],
        },
        subtitle: {
            type: String,
            required: [true, 'Please provide a subtitle'],
        },
        image: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        link: {
            type: String,
            required: [true, 'Please provide a target link for the banner button'],
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        order: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Banner', bannerSchema);
