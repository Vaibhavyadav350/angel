const Product = require('../models/productModel');
const Settings = require('../models/settingsModel');
const Coupon = require('../models/couponModel');

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
 * @param {{ shippingMethod?: string, couponCode?: string }} opts
 */
exports.computeAuthoritativeOrder = async (cart = [], { shippingMethod = 'standard', couponCode = '' } = {}) => {
  const settings = (await Settings.findOne()) || {};
  const standardFee = Number(settings.standardShippingPrice ?? 8);
  const expressFee = Number(settings.expressShippingPrice ?? 18);
  const expressEnabled = settings.expressEnabled ?? true;
  const freeThreshold = Number(settings.freeShippingThreshold ?? 200);
  const gstRate = Number(settings.gstRate ?? 10);

  // Authoritative line items + subtotal from product documents.
  const items = [];
  let sellingTotal = 0;
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
      if (Number(variant.stock || 0) < qty) {
        throw httpError(
          `Stock Error: Only ${Number(variant.stock || 0)} left for ${product.name} in ${variant.size} / ${variant.color}.`,
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
    items.push({
      productId: String(productId),
      qty,
      selling,
      mrp: Number(product.price) || 0,
      name: product.name,
      color,
      size,
    });
  }
  sellingTotal = round2(sellingTotal);

  // Coupon re-validated server-side (same rules as the public validate endpoint).
  let couponDiscount = 0;
  let validCouponCode = '';
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: String(couponCode).toUpperCase(), active: true });
    const valid =
      coupon &&
      new Date() <= coupon.expiryDate &&
      coupon.usedCount < coupon.usageLimit &&
      sellingTotal >= coupon.minPurchase;
    if (valid) {
      const raw = coupon.discountType === 'PERCENTAGE' ? (sellingTotal * coupon.amount) / 100 : coupon.amount;
      couponDiscount = round2(Math.min(Math.max(raw, 0), sellingTotal));
      validCouponCode = coupon.code;
    }
  }

  // What the customer actually pays for goods, after the product markdown AND the
  // coupon. The free-shipping threshold is tested against THIS, not the pre-coupon
  // subtotal — otherwise a $210 cart with a $50 coupon paid $160 and still shipped free.
  const goodsPayable = round2(Math.max(0, sellingTotal - couponDiscount));

  // Shipping from settings (Express only if enabled; free standard over threshold).
  const method = shippingMethod === 'express' && expressEnabled ? 'express' : 'standard';
  let shipping = method === 'express' ? expressFee : standardFee;
  if (method === 'standard' && freeThreshold > 0 && goodsPayable >= freeThreshold) shipping = 0;
  if (items.length === 0) shipping = 0;

  const total = round2(goodsPayable + shipping);
  const gstAmount = round2(total - total / (1 + gstRate / 100));

  return { items, sellingTotal, goodsPayable, shipping, method, couponDiscount, couponCode: validCouponCode, total, gstAmount, gstRate };
};
