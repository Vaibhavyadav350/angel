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

// Delivery options for the checkout selector, with fees from store settings.
export const shippingMethods = (config = {}) => {
  const std = config.standardShippingPrice ?? DEFAULT_PRICING.standardShippingPrice;
  const exp = config.expressShippingPrice ?? DEFAULT_PRICING.expressShippingPrice;
  const methods = { standard: { key: 'standard', label: 'Regular Post', fee: std, eta: '3–10 business days' } };
  if (config.expressEnabled ?? DEFAULT_PRICING.expressEnabled) {
    methods.express = { key: 'express', label: 'Express Post', fee: exp, eta: 'Next day – 2 days' };
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

export const shippingFee = (method, config = {}) => {
  const methods = shippingMethods(config);
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

  let delivery = cart.length > 0 ? shippingFee(method, config) : 0;
  // Free standard shipping over the configured threshold (0 = disabled).
  const threshold = config.freeShippingThreshold ?? DEFAULT_PRICING.freeShippingThreshold;
  if (method !== 'express' && threshold > 0 && goodsPayable >= threshold) {
    delivery = 0;
  }

  const toPay = round2(goodsPayable + delivery);
  return {
    itemTotal,
    productDiscount,
    sellingTotal,
    goodsPayable,
    coupon: couponValue,
    delivery,
    toPay,
    gst: gstIncludedIn(toPay, config.gstRate ?? DEFAULT_PRICING.gstRate),
  };
};
