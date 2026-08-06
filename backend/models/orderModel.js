const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  shippingInfo: {
    address: {
      type: String,
      required: true,
    },
    city: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    country: {
      type: String,
      required: true,
    },
    pinCode: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    trackingNumber: String,
    carrier: {
      type: String,
      default: 'Australia Post',
    },
  },
  orderItems: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      mrp: {
        type: Number, // recommended retail price per unit (before per-product discount)
      },
      quantity: {
        type: Number,
        required: true,
      },
      image: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
      product: {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
        required: true,
      },
    },
  ],
  user: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      default: 'guest',
    },
  },
  paymentInfo: {
    id: {
      type: String,
      required: true,
      unique: true, // Prevents duplicate orders for the same eWAY TransactionID
    },
    status: {
      type: String,
      required: true,
    },
  },
  paidAt: {
    type: Date,
    required: true,
  },
  itemsPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  taxPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  // How the shipping figure was arrived at, so the charge is auditable later.
  shippingBreakdown: {
    weightGrams: { type: Number, default: 0 },
    band: { type: String, default: '' },
    zone: { type: String, default: '' },
    baseFee: { type: Number, default: 0 },
    surcharge: { type: Number, default: 0 },
    freeCredit: { type: Number, default: 0 },
  },
  shippingPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    default: 0,
  },
  discountAmount: {
    type: Number,
    default: 0,
  },
  couponCode: {
    type: String,
    default: '',
  },
  addOns: [
    {
      name: { type: String },
      price: { type: Number },
    },
  ],
  orderStatus: {
    type: String,
    required: true,
    default: 'processing',
  },
  returnStatus: {
    type: String,
    enum: ['none', 'requested', 'approved', 'processing', 'rejected', 'completed'],
    default: 'none',
  },
  returnReason: String,
  returnRequestedAt: Date,
  deliveredAt: Date,
  returnedAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
