const mongoose = require('mongoose');

const settingsSchema = new mongoose.Schema(
    {
        // --- Shipping (AUD, GST-inclusive) ---
        standardShippingPrice: {
            type: Number,
            default: 8,
        },
        expressShippingPrice: {
            type: Number,
            default: 18,
        },
        expressEnabled: {
            type: Boolean,
            default: true,
        },
        // Standard shipping becomes free when the discounted subtotal is at or
        // above this amount. 0 disables free shipping.
        freeShippingThreshold: {
            type: Number,
            default: 200,
        },
        // --- Tax ---
        gstRate: {
            type: Number,
            default: 10, // % GST, included in displayed prices
        },
        announcementText: {
            type: String,
            default: 'Complimentary shipping on all domestic orders.',
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
