const mongoose = require('mongoose');

const pendingCheckoutSchema = new mongoose.Schema({
  accessCode: {
    type: String,
    required: true,
    unique: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'expired'],
    default: 'pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    // Auto-delete after 48 hours — AccessCodes expire around 24h, keep a buffer
    expires: 48 * 60 * 60,
  },
});

module.exports = mongoose.model('PendingCheckout', pendingCheckoutSchema);
