const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a coupon code'],
        unique: true,
        uppercase: true,
        trim: true
    },
    discountType: {
        type: String,
        required: true,
        enum: ['PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING'],
        default: 'PERCENTAGE'
    },
    amount: {
        type: Number,
        required: true
    },
    expiryDate: {
        type: Date,
        required: true
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    usageLimit: {
        type: Number,
        default: 100
    },
    usedCount: {
        type: Number,
        default: 0
    },
    // Guard rails. Without these a code could be stacked on already-discounted
    // stock, and `usageLimit` alone is a GLOBAL cap — one person could burn all
    // 100 uses themselves.
    excludeDiscountedItems: {
        type: Boolean,
        default: true, // sale stock is already marked down; don't discount it twice
    },
    perCustomerLimit: {
        type: Number,
        default: 1, // 0 = unlimited
    },
    firstOrderOnly: {
        type: Boolean,
        default: false,
    },
    // Emails that have already redeemed this code, for the per-customer limit.
    redeemedBy: [
        {
            _id: false,
            email: { type: String },
            count: { type: Number, default: 1 },
        },
    ],
    active: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Coupon', couponSchema);
