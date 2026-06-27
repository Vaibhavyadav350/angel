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

// Optional add-on services and the Settings field each is priced from.
const ADDON_DEFS = {
  hemming: { name: 'Hemming / Alteration', priceKey: 'hemmingPrice' },
  giftBox: { name: 'Gift Box', priceKey: 'giftBoxPrice' },
  petticoat: { name: 'Petticoat', priceKey: 'petticoatPrice' },
};

// Resolve selected add-on keys to { name, price } using the live settings prices.
exports.resolveAddons = (keys = [], settings = {}) =>
  (keys || [])
    .map((key) => {
      const def = ADDON_DEFS[key];
      if (!def) return null;
      const price = Number(settings[def.priceKey] || 0);
      return price > 0 ? { key, name: def.name, price } : null;
    })
    .filter(Boolean);

/**
 * The authoritative, server-computed pricing for an order. NEVER trusts amounts
 * sent by the browser — prices come from the product documents, shipping/GST from
 * Settings, and the coupon is re-validated against the DB. This is what we charge.
 *
 * @param {Array} cart  client cart entries: { productId|id, amount|quantity, color, size }
 * @param {{ shippingMethod?: string, couponCode?: string }} opts
 */
exports.computeAuthoritativeOrder = async (cart = [], { shippingMethod = 'standard', couponCode = '', addons = [] } = {}) => {
  const settings = (await Settings.findOne()) || {};
  const standardFee = Number(settings.standardShippingPrice ?? 15);
  const expressFee = Number(settings.expressShippingPrice ?? 65);
  const expressEnabled = settings.expressEnabled ?? true;
  const freeThreshold = Number(settings.freeShippingThreshold ?? 0);
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
    if (product.stock < qty) throw httpError(`Stock Error: Only ${product.stock} left for ${product.name}.`, 400);

    const selling = sellingPriceOf(product);
    sellingTotal += selling * qty;
    items.push({
      productId: String(productId),
      qty,
      selling,
      mrp: Number(product.price) || 0,
      name: product.name,
      color: entry.color || 'Standard',
      size: entry.size || 'M',
    });
  }
  sellingTotal = round2(sellingTotal);

  // Shipping from settings (Express only if enabled; free over threshold).
  const method = shippingMethod === 'express' && expressEnabled ? 'express' : 'standard';
  let shipping = method === 'express' ? expressFee : standardFee;
  if (method === 'standard' && freeThreshold > 0 && sellingTotal >= freeThreshold) shipping = 0;
  if (items.length === 0) shipping = 0;

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

  // Add-on services, priced from settings (never from the client).
  const resolvedAddons = exports.resolveAddons(addons, settings);
  const addonsTotal = round2(resolvedAddons.reduce((s, a) => s + a.price, 0));

  const total = round2(Math.max(0, sellingTotal - couponDiscount) + shipping + addonsTotal);
  const gstAmount = round2(total - total / (1 + gstRate / 100));

  return { items, sellingTotal, shipping, method, couponDiscount, couponCode: validCouponCode, addons: resolvedAddons, addonsTotal, total, gstAmount, gstRate };
};
