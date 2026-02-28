const mongoose = require('mongoose');

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
    enum: ['Women', 'Men', 'Kids', 'Jewelry'],
  },
  subCategory: {
    type: String,
    required: [true, 'Please enter product sub-category'],
    enum: [
      'Salwar Kameez', 'Sarees', 'Lehengas',
      'Sherwanis', 'Jacket', 'Kurtas',
      'Girls', 'Boys',
      'Bridal', 'Casual'
    ],
  },
  productType: {
    type: String,
    default: '',
  },
  collections: {
    type: [String],
    enum: ['New Arrivals', 'Ready To Ship', 'Best Sellers', 'Sale', 'Plus Sizes'],
    default: [],
  },
  stock: {
    type: Number,
    required: [true, 'Please enter product stock'],
    max: [9999, 'Stock cannot exceed 9999'],
    min: 0,
    default: 1,
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
  admin: {
    type: mongoose.Schema.ObjectId,
    ref: 'Admin',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.model('Product', productSchema);
