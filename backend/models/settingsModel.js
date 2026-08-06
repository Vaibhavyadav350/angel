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
        // Standard shipping becomes free once the amount PAYABLE (after the product
        // markdown and the coupon) reaches this. 0 disables free shipping.
        freeShippingThreshold: {
            type: Number,
            default: 200,
        },
        // Weight bands, in grams, with the fee for each delivery method. Left empty
        // the defaults in frontend/src/utils/shipping.json apply.
        shippingBands: {
            type: [
                {
                    _id: false,
                    maxGrams: { type: Number, required: true },
                    standard: { type: Number, required: true },
                    express: { type: Number, required: true },
                    label: { type: String, default: '' },
                },
            ],
            default: [],
        },
        // Flat surcharge added to standard post for WA / NT / TAS. Kept at 0 until the
        // published "$8 anywhere in Australia" line is reworded.
        remoteSurcharge: {
            type: Number,
            default: 0,
        },
        // Carts heavier than this cannot check out; the customer is asked to request
        // a quote instead. Stops a wholesale-sized order shipping for a retail fee.
        quoteAboveGrams: {
            type: Number,
            default: 22000,
        },
        // Absolute backstop so a data error can never bill a customer hundreds.
        maxShippingCharge: {
            type: Number,
            default: 120,
        },
        // --- Tax ---
        gstRate: {
            type: Number,
            default: 10, // % GST, included in displayed prices
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Settings', settingsSchema);
