const mongoose = require('mongoose');

const featuredCollectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide a collection name'],
        },
        description: {
            type: String,
        },
        image: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        targetUrl: {
            type: String,
            required: [true, 'Please provide a target URL'],
        },
        section: {
            type: String,
            enum: ['home_occasions', 'mega_menu_featured', 'bridaledit'],
            required: true,
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

module.exports = mongoose.model('FeaturedCollection', featuredCollectionSchema);
