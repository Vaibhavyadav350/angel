import shippingConfig from './shipping.json';

// ---------------------------------------------------------------------------
// Single source of truth for money math across the whole storefront.
//
// Pricing model (agreed with the owner):
//   • All amounts are AUD and GST-INCLUSIVE (Australian consumer law). GST is
//     never added on top — it is the portion already inside the price.
//   • product.price is the RRP (recommended retail price), GST-inclusive.
//   • product.discountPercent is an optional per-product markdown, set in the
//     Add/Edit Product screen. The customer pays the SELLING price:
//         sellingPrice = price * (1 - discountPercent/100)
//   • Coupon codes apply a further discount on top, at checkout.
//   • Shipping is a flat method priced from Store Settings (Standard / Express),
//     free on Standard once the amount actually payable reaches the threshold.
//
// Every surface (product card, detail page, cart, checkout, order summary,
// invoice, admin) must read prices through these helpers so a product can only
// ever have one selling price and one breakdown.
// ---------------------------------------------------------------------------

// Fallback defaults — used only until Store Settings are loaded. The real
// values come from the Settings document via `config`.
export const DEFAULT_PRICING = {
  standardShippingPrice: 8,
  expressShippingPrice: 18,
  expressEnabled: true,
  freeShippingThreshold: 200,
  gstRate: 10, // percent
};

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

// ---------------------------------------------------------------------------
// Weight-banded shipping. Mirrors backend/services/shippingService.js, which is
// what actually charges — this exists so the cart shows the same number.
// ---------------------------------------------------------------------------

// Shipped weight of one cart line, in grams. Derived from the category so the
// owner never enters a weight; an explicit per-product value wins when present.
export const lineWeightGrams = (item = {}) => {
  const override = Number(item.shippingWeightGrams || 0);
  if (override > 0) return override;
  const { categoryWeights, defaultWeightGrams } = shippingConfig;
  return Number(
    categoryWeights[`${item.category}.${item.subCategory}`] ??
      categoryWeights[item.category] ??
      defaultWeightGrams
  );
};

export const cartWeightGrams = (cart = []) =>
  cart.reduce((sum, i) => sum + lineWeightGrams(i) * Number(i.amount || 0), 0);

const bandsFrom = (config = {}) => {
  const custom = config.shippingBands;
  const usable =
    Array.isArray(custom) && custom.length > 0 && custom.every((b) => Number(b?.maxGrams) > 0);
  return (usable ? custom : shippingConfig.bands)
    .map((b) => ({ ...b, maxGrams: Number(b.maxGrams) }))
    .sort((a, b) => a.maxGrams - b.maxGrams);
};

/** The band a cart falls into, or null when it is too heavy to price automatically. */
export const bandForWeight = (grams, config = {}) => {
  const quoteAbove = Number(config.quoteAboveGrams ?? shippingConfig.quoteAboveGrams);
  if (grams > quoteAbove) return null;
  const bands = bandsFrom(config);
  return bands.find((b) => grams <= b.maxGrams) || bands[bands.length - 1];
};

/** Longest make-time in the cart — the delivery estimate must start after this. */
export const cartLeadTimeDays = (cart = []) =>
  cart.reduce((max, i) => Math.max(max, Number(i.leadTimeDays || 0)), 0);

// Delivery options for the checkout selector, priced for the cart in hand.
export const shippingMethods = (config = {}, cart = []) => {
  const grams = cartWeightGrams(cart);
  const band = bandForWeight(grams, config);
  const lead = cartLeadTimeDays(cart);
  // Made-to-order stock must be reflected, or Express promises next-day delivery
  // on a garment that has not been sewn yet.
  const withLead = (transit) => (lead > 0 ? `Made in ${lead} days, then ${transit}` : transit);

  const std = band ? Number(band.standard) : config.standardShippingPrice ?? DEFAULT_PRICING.standardShippingPrice;
  const exp = band ? Number(band.express) : config.expressShippingPrice ?? DEFAULT_PRICING.expressShippingPrice;

  const methods = {
    standard: { key: 'standard', label: 'Regular Post', fee: std, eta: withLead('3–10 business days') },
  };
  if (config.expressEnabled ?? DEFAULT_PRICING.expressEnabled) {
    methods.express = { key: 'express', label: 'Express Post', fee: exp, eta: withLead('Next day – 2 days') };
  }
  return methods;
};

// RRP per unit (the "before" price, GST-inclusive).
export const unitRrp = (product) => Number(product?.price || 0);

// Selling price per unit after the per-product discount (GST-inclusive).
export const unitSellingPrice = (product) => {
  const price = Number(product?.price || 0);
  const discount = Number(product?.discountPercent || 0);
  return round2(price * (1 - discount / 100));
};

export const shippingFee = (method, config = {}, cart = []) => {
  const methods = shippingMethods(config, cart);
  return (methods[method] || methods.standard).fee;
};

// GST already contained inside a GST-inclusive gross amount (= gross / 11 at 10%).
export const gstIncludedIn = (grossAmount, gstRate = DEFAULT_PRICING.gstRate) => {
  const gross = Number(grossAmount || 0);
  const rate = Number(gstRate) / 100;
  return round2(gross - gross / (1 + rate));
};

// Coupon discount in dollars, given the coupon definition and the amount it applies to.
export const couponDiscountAmount = (coupon, base) => {
  if (!coupon || !coupon.amount) return 0;
  const value = coupon.type === 'PERCENTAGE'
    ? (Number(base) * Number(coupon.amount)) / 100
    : Number(coupon.amount);
  return round2(Math.min(Math.max(value, 0), Number(base)));
};

/**
 * The complete, itemised order breakdown. Cart items carry `price` (selling,
 * what they pay) and `mrp` (RRP, before discount).
 *
 * Returns every line shown to the customer and stored on the order:
 *   itemTotal       sum of RRP × qty
 *   productDiscount itemTotal − sellingTotal
 *   sellingTotal    sum of selling price × qty (the discounted subtotal)
 *   coupon          coupon discount in dollars
 *   delivery        shipping fee for the chosen method
 *   toPay           final payable amount
 *   gst             GST already included inside toPay
 */
export const computeOrderSummary = (cart = [], { method = 'standard', coupon = null, config = {} } = {}) => {
  const itemTotal = round2(cart.reduce((s, i) => s + Number(i.mrp ?? i.price ?? 0) * Number(i.amount || 0), 0));
  const sellingTotal = round2(cart.reduce((s, i) => s + Number(i.price ?? 0) * Number(i.amount || 0), 0));
  const productDiscount = round2(itemTotal - sellingTotal);
  const couponValue = couponDiscountAmount(coupon, sellingTotal);

  // What is actually payable for goods, after the product markdown AND the coupon.
  // The free-shipping threshold is tested against this — not the pre-coupon subtotal —
  // so a coupon that drops the order under the threshold also withdraws free shipping.
  // Must stay identical to computeAuthoritativeOrder() on the server, which is what charges.
  const goodsPayable = round2(Math.max(0, sellingTotal - couponValue));

  const weightGrams = cartWeightGrams(cart);
  const band = bandForWeight(weightGrams, config);
  const requiresQuote = cart.length > 0 && band === null;

  let delivery = cart.length > 0 ? shippingFee(method, config, cart) : 0;

  // Free standard shipping credits the headline standard rate once the payable
  // amount reaches the threshold, so an ordinary order is genuinely free and a
  // bulky one pays only the excess.
  const threshold = config.freeShippingThreshold ?? DEFAULT_PRICING.freeShippingThreshold;
  let freeCredit = 0;
  if (method !== 'express' && threshold > 0 && goodsPayable >= threshold) {
    const headlineRate = config.standardShippingPrice ?? DEFAULT_PRICING.standardShippingPrice;
    freeCredit = Math.min(delivery, headlineRate);
    delivery = round2(delivery - freeCredit);
  }
  if (requiresQuote) delivery = 0;

  const toPay = round2(goodsPayable + delivery);
  return {
    itemTotal,
    productDiscount,
    sellingTotal,
    goodsPayable,
    coupon: couponValue,
    delivery,
    freeCredit,
    weightGrams,
    band: band ? band.label : null,
    requiresQuote,
    leadTimeDays: cartLeadTimeDays(cart),
    toPay,
    gst: gstIncludedIn(toPay, config.gstRate ?? DEFAULT_PRICING.gstRate),
  };
};
