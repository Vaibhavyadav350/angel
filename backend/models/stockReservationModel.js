const mongoose = require('mongoose');

/**
 * A short-lived hold on one size/colour while a customer is paying.
 *
 * Stock is only decremented once eWAY confirms, so between "pay now" and the
 * callback the piece was still purchasable by someone else. Most products here
 * have a stock of 1, so two customers could pay for the same garment and one
 * would then need cancelling and refunding.
 *
 * Documents delete themselves via the TTL index on `expiresAt`, so an abandoned
 * checkout releases its hold without any cleanup job.
 */
const stockReservationSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.ObjectId, ref: 'Product', required: true, index: true },
    size: { type: String, default: '' },
    color: { type: String, default: '' },
    qty: { type: Number, required: true, min: 1 },
    // eWAY access code for this checkout — used to release the hold once the
    // order is created, or if the customer cancels.
    accessCode: { type: String, index: true },
    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

// MongoDB removes the document once `expiresAt` passes.
stockReservationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('StockReservation', stockReservationSchema);
