const Product = require('../models/productModel');
const Settings = require('../models/settingsModel');
const Coupon = require('../models/couponModel');
const shippingService = require('./shippingService');
const StockReservation = require('../models/stockReservationModel');

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

const sellingPriceOf = (product) => {
  const price = Number(product.price) || 0;
  const discount = Number(product.discountPercent) || 0;
  return round2(price * (1 - discount / 100));
};

const httpError = (message, statusCode) => {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
};

/**
 * The authoritative, server-computed pricing for an order. NEVER trusts amounts
 * sent by the browser — prices come from the product documents, shipping/GST from
 * Settings, and the coupon is re-validated against the DB. This is what we charge.
 *
 * @param {Array} cart  client cart entries: { productId|id, amount|quantity, color, size }
 * @param {{ shippingMethod?: string, couponCode?: string, shippingAddress?: object }} opts
 */
exports.computeAuthoritativeOrder = async (cart = [], { shippingMethod = 'standard', couponCode = '', shippingAddress = {}, customerEmail = '' } = {}) => {
  const settings = (await Settings.findOne()) || {};
  const expressEnabled = settings.expressEnabled ?? true;
  const gstRate = Number(settings.gstRate ?? 10);

  // Authoritative line items + subtotal from product documents.
  const items = [];
  const lines = []; // product documents, for the weight-based shipping calculation
  let sellingTotal = 0;
  let fullPriceTotal = 0; // subtotal excluding products already marked down
  for (const entry of cart) {
    const productId = entry.productId || entry.id;
    if (!productId) continue;
    const product = await Product.findById(productId);
    if (!product) throw httpError(`Product not found: ${entry.name || productId}`, 404);

    const qty = Number(entry.amount || entry.quantity || 1);
    let color = entry.color || '';
    let size = entry.size || '';

    // Stock must be checked against the exact size/colour being bought. Checking the
    // aggregate `stock` field let someone order size XL while only S was in stock,
    // because the total across all variants covered the quantity.
    //
    // Sizeless products (jewellery) are stored inconsistently as "M" / "Free Size" /
    // "One Size", so resolve leniently rather than rejecting a legitimate order:
    // match case-insensitively, and fall back to the only variant when there is one.
    const variants = product.variants || [];
    if (variants.length > 0) {
      const eq = (a, b) => String(a || '').trim().toLowerCase() === String(b || '').trim().toLowerCase();
      let variant = variants.find((v) => eq(v.size, size) && eq(v.color, color));

      if (!variant && variants.length === 1) variant = variants[0];
      if (!variant && !size) variant = variants.find((v) => eq(v.color, color));
      if (!variant && !color) variant = variants.find((v) => eq(v.size, size));

      if (!variant) {
        const available = variants.map((v) => `${v.size} / ${v.color}`).join(', ');
        throw httpError(
          `${product.name} is not available in ${size || 'that size'} / ${color || 'that colour'}. Available: ${available}.`,
          400
        );
      }
      // Anything another customer is currently paying for is not available.
      const heldDocs = await StockReservation.find({
        product: product._id,
        size: variant.size,
        color: variant.color,
        expiresAt: { $gt: new Date() },
      });
      const held = heldDocs.reduce((sum, r) => sum + Number(r.qty || 0), 0);
      const available = Math.max(0, Number(variant.stock || 0) - held);

      if (available < qty) {
        throw httpError(
          `Stock Error: Only ${available} left for ${product.name} in ${variant.size} / ${variant.color}.`,
          400
        );
      }
      // Record what we actually validated, so the order and the stock decrement agree.
      size = variant.size;
      color = variant.color;
    } else {
      if (product.stock < qty) throw httpError(`Stock Error: Only ${product.stock} left for ${product.name}.`, 400);
      size = size || 'Standard';
      color = color || 'Standard';
    }

    const selling = sellingPriceOf(product);
    sellingTotal += selling * qty;
    // Coupons that exclude sale stock apply only to this portion.
    if (!(Number(product.discountPercent) > 0)) fullPriceTotal += selling * qty;
    items.push({
      productId: String(productId),
      qty,
      selling,
      mrp: Number(product.price) || 0,
      name: product.name,
      color,
      size,
    });
    lines.push({ product, qty });
  }
  sellingTotal = round2(sellingTotal);
  fullPriceTotal = round2(fullPriceTotal);

  // Coupon re-validated server-side (same rules as the public validate endpoint).
  let couponDiscount = 0;
  let validCouponCode = '';
  let couponFreeShipping = false;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), active: true });

    // `usageLimit` is a global cap; on its own one person could burn every use.
    const email = String(customerEmail || '').trim().toLowerCase();
    const priorUses = email
      ? (coupon?.redeemedBy || []).find((r) => String(r.email).toLowerCase() === email)?.count || 0
      : 0;
    const perCustomerLimit = Number(coupon?.perCustomerLimit ?? 0);

    const valid =
      coupon &&
      new Date() <= coupon.expiryDate &&
      coupon.usedCount < coupon.usageLimit &&
      sellingTotal >= coupon.minPurchase &&
      (perCustomerLimit <= 0 || priorUses < perCustomerLimit);

    if (valid) {
      // Sale stock is already marked down — don't discount it a second time
      // unless this coupon is explicitly allowed to.
      const base = coupon.excludeDiscountedItems ? fullPriceTotal : sellingTotal;
      if (coupon.discountType === 'FREE_SHIPPING') {
        couponFreeShipping = true;
        validCouponCode = coupon.code;
      } else if (base > 0) {
        const raw = coupon.discountType === 'PERCENTAGE' ? (base * coupon.amount) / 100 : coupon.amount;
        couponDiscount = round2(Math.min(Math.max(raw, 0), base));
        validCouponCode = coupon.code;
      }
    }
  }

  // What the customer actually pays for goods, after the product markdown AND the
  // coupon. The free-shipping threshold is tested against THIS, not the pre-coupon
  // subtotal — otherwise a $210 cart with a $50 coupon paid $160 and still shipped free.
  const goodsPayable = round2(Math.max(0, sellingTotal - couponDiscount));

  // Shipping is weight-banded and computed from the product documents, never from
  // anything the browser sent. Express is only offered when enabled in Settings.
  const method = shippingMethod === 'express' && expressEnabled ? 'express' : 'standard';
  const delivery = shippingService.calculateShipping(lines, shippingAddress, settings, {
    method,
    goodsPayable,
  });

  if (delivery.requiresQuote) {
    throw httpError(
      'This order is too large to ship automatically. Please contact us for a shipping quote.',
      400
    );
  }

  // A FREE_SHIPPING coupon waives the standard fee entirely.
  const shipping = couponFreeShipping && delivery.method === 'standard' ? 0 : delivery.fee;
  const total = round2(goodsPayable + shipping);
  const gstAmount = round2(total - total / (1 + gstRate / 100));

  return {
    items,
    sellingTotal,
    goodsPayable,
    shipping,
    method: delivery.method,
    // Stored on the order so the owner can answer "why was I charged this?".
    shippingBreakdown: {
      weightGrams: delivery.weightGrams,
      band: delivery.band,
      zone: delivery.zone,
      baseFee: delivery.baseFee,
      surcharge: delivery.surcharge,
      freeCredit: delivery.freeCredit,
    },
    couponDiscount,
    couponCode: validCouponCode,
    total,
    gstAmount,
    gstRate,
  };
};
