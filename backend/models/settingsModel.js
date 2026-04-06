const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        priorityShippingPrice: {
            type: Number,
            default: 3500,
        },
        hemmingPrice: {
            type: Number,
            default: 800,
        },
        giftBoxPrice: {
            type: Number,
            default: 400,
        },
        petticoatPrice: {
            type: Number,
            default: 600,
        },
        announcementText: {
            type: String,
            default: 'Complimentary shipping on all domestic orders.',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
