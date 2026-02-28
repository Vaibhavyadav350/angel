const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
        unique: true, // This is the Firebase UID
    },
    email: {
        type: String,
        required: true,
    },
    wishlist: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
        }
    ],
    totalSpend: {
        type: Number,
        default: 0
    },
    orderCount: {
        type: Number,
        default: 0
    },
    isVIP: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

module.exports = mongoose.model('UserProfile', userProfileSchema);
