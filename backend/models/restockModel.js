const mongoose = require('mongoose');

const restockSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true
    },
    email: {
        type: String,
        required: [true, 'Please provide your email'],
        lowercase: true
    },
    notified: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Restock', restockSchema);
