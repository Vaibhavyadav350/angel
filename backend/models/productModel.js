const mongoose = require('mongoose');
const taxonomy = require('../../frontend/src/utils/taxonomy.json');

const validCategories = Object.keys(taxonomy.categories);
let validSubCategories = [];
let validProductTypes = [];
Object.values(taxonomy.categories).forEach(subCatObj => {
  validSubCategories = [...validSubCategories, ...Object.keys(subCatObj)];
  Object.values(subCatObj).forEach(types => {
    validProductTypes = [...validProductTypes, ...types];
  });
});
const validCollections = taxonomy.collections;
const validColors = (taxonomy.colors || []).map((c) => c.name);
const validSizes = taxonomy.sizes || [];

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
  // What the piece cost to buy/make, GST-inclusive. ADMIN ONLY — never sent to the
  // storefront. Without it there is no way to tell whether a markdown plus free
  // delivery still makes money on an order.
  costPrice: {
    type: Number,
    default: 0,
  },
  discountPercent: {
    type: Number,
    // Must default to 0. A non-zero default silently marks down every product added
    // without touching this field — the owner was setting 41 of 58 back to 0 by hand.
    default: 0,
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
      enum: validColors,
    },
  ],
  sizes: [
    {
      type: String,
      required: true,
      enum: validSizes,
    },
  ],
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
    enum: [...validProductTypes, ''],
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
  // Optional per-product shipped weight. Blank/0 means "use the category default"
  // from shipping.json, which is the normal case — the owner enters nothing.
  shippingWeightGrams: {
    type: Number,
    default: 0,
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
