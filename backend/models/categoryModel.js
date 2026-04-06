const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please enter category name'],
        unique: true
    },
    slug: {
        type: String,
    },
    description: {
        type: String,
    },
    imageUrl: {
        type: String,
    },
    icon: {
        type: String,
        default: 'folder',
    },
    sortOrder: {
        type: Number,
        default: 1,
    },
    subcategories: [
        {
            name: String,
            slug: String
        }
    ],
    isActive: {
        type: Boolean,
        default: true
    },
    productCount: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Category', categorySchema);
