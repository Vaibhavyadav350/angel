const mongoose = require('mongoose');
const taxonomy = require('../../frontend/src/utils/taxonomy.json');

const validCategories = Object.keys(taxonomy.categories);
let validSubCategories = [];
Object.values(taxonomy.categories).forEach(subCatObj => {
  validSubCategories = [...validSubCategories, ...Object.keys(subCatObj)];
});
const validCollections = taxonomy.collections;

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter product name'],
  },
  description: {
    type: String,
    required: [true, 'Please enter product description'],
  },
  price: {
    type: Number,
    required: [true, 'Please enter product price'],
    max: [99999999, 'Price cannot exceed 99,999,999'],
  },
  discountPercent: {
    type: Number,
    default: 20,
  },
  taxPercent: {
    type: Number,
    default: 10,
  },
  rating: {
    type: Number,
    default: 0,
  },
  images: [
    {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
  ],
  colors: [
    {
      type: String,
      required: true,
    },
  ],
  sizes: [{ type: String, required: true }],
  company: {
    type: String,
    required: [true, 'Please enter product company'],
  },
  category: {
    type: String,
    required: [true, 'Please enter product category'],
    enum: validCategories,
  },
  subCategory: {
    type: String,
    required: [true, 'Please enter product sub-category'],
    enum: validSubCategories,
  },
  productType: {
    type: String,
    default: '',
  },
  collections: {
    type: [String],
    enum: validCollections,

    default: [],
  },
  // True E-commerce Variant Matrix
  variants: [
    {
      size: { type: String, required: true },
      color: { type: String, required: true },
      stock: {
        type: Number,
        required: true,
        min: [0, 'Variant stock cannot be negative'],
        default: 0
      },
      sku: { type: String } // Optional specific SKU for this variant
    }
  ],
  // Keep a global virtual or derived field for simple front-end 'is in stock' checks if needed
  stock: {
    type: Number,
    default: 0,
  },
  numberOfReviews: {
    type: Number,
    default: 0,
  },
  reviews: [
    {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      rating: {
        type: Number,
        required: true,
      },
      comment: {
        type: String,
        required: true,
      },
    },
  ],
  shipping: {
    type: Boolean,
    default: true,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  isTrending: {
    type: Boolean,
    default: false,
  },
  badgeText: {
    type: String,
    default: '',
  },
  leadTimeDays: {
    type: Number,
    default: 0,
  },
  composition: {
    type: String,
    default: '',
  },
  careInstructions: {
    type: String,
    default: '',
  },
  crossSellProducts: [
    {
      type: mongoose.Schema.ObjectId,
      ref: 'Product',
    },
  ],
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Product', productSchema);
