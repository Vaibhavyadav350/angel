const shippingConfig = require('../../frontend/src/utils/shipping.json');

const round2 = (n) => Math.round((Number(n) + Number.EPSILON) * 100) / 100;

/**
 * Shipped weight for one product, in grams.
 *
 * Derived from the taxonomy so the owner never has to enter a weight — she has no
 * logistics background and any per-product field she must maintain by hand would
 * drift out of date. `shippingWeightGrams` on the product overrides it when set.
 * Falls back to a real garment weight (never 0) for anything unmatched, so a bad
 * category can only ever overcharge slightly, never ship heavy goods for nothing.
 */
const weightOf = (product) => {
  const override = Number(product?.shippingWeightGrams || 0);
  if (override > 0) return override;

  const { categoryWeights, defaultWeightGrams } = shippingConfig;
  const category = product?.category || '';
  const subCategory = product?.subCategory || '';

  return Number(
    categoryWeights[`${category}.${subCategory}`] ??
      categoryWeights[category] ??
      defaultWeightGrams
  );
};
exports.weightOf = weightOf;

/** Total shipped weight of the cart, in grams. Quantity must multiply the line weight. */
exports.cartWeight = (lines = []) =>
  lines.reduce((sum, l) => sum + weightOf(l.product) * Number(l.qty || 0), 0);

/** Map an Australian postcode to a zone key. Unknown/absent -> the surcharged zone. */
exports.zoneForPostcode = (postcode) => {
  const pc = parseInt(String(postcode ?? '').trim(), 10);
  // An unreadable postcode must never fall through to the cheapest zone.
  if (!Number.isFinite(pc)) return 'remote';
  const hit = shippingConfig.postcodeRanges.find((r) => pc >= r.from && pc <= r.to);
  return hit ? hit.zone : 'standard';
};

/** The band table, preferring the owner's Settings override when she has set one. */
const bandsFrom = (settings = {}) => {
  const custom = settings.shippingBands;
  const usable =
    Array.isArray(custom) && custom.length > 0 && custom.every((b) => Number(b?.maxGrams) > 0);
  return (usable ? custom : shippingConfig.bands)
    .map((b) => ({
      maxGrams: Number(b.maxGrams),
      standard: Number(b.standard),
      express: Number(b.express),
      label: b.label || `Up to ${Number(b.maxGrams) / 1000} kg`,
    }))
    .sort((a, b) => a.maxGrams - b.maxGrams);
};
exports.bandsFrom = bandsFrom;

/**
 * Authoritative shipping calculation.
 *
 * @param {Array}  lines     [{ product, qty }] — product documents, never client data
 * @param {Object} address   { postal_code | postalCode | zip }
 * @param {Object} settings  the Settings document
 * @param {Object} opts      { method: 'standard'|'express', goodsPayable: number }
 *
 * `goodsPayable` must be the amount payable AFTER the product markdown and the
 * coupon. Testing the free-shipping threshold against the pre-coupon subtotal let
 * a $210 cart with a $50 coupon pay $160 and still ship free.
 */
exports.calculateShipping = (lines = [], address = {}, settings = {}, opts = {}) => {
  const method = opts.method === 'express' ? 'express' : 'standard';
  const goodsPayable = Number(opts.goodsPayable || 0);

  const weightGrams = exports.cartWeight(lines);
  const bands = bandsFrom(settings);

  // A missing or zero cutoff must fall back to the configured default, never to 0.
  // `?? ` alone was not enough: a stored 0 is not null, so it survived and made
  // `weightGrams > 0` true for every cart — blocking the entire checkout.
  const positiveOr = (value, fallback) => {
    const n = Number(value);
    return Number.isFinite(n) && n > 0 ? n : fallback;
  };
  const quoteAbove = positiveOr(settings.quoteAboveGrams, shippingConfig.quoteAboveGrams);
  const maxCharge = positiveOr(settings.maxShippingCharge, shippingConfig.maxShippingCharge);

  const empty = lines.length === 0 || weightGrams <= 0;
  if (empty) {
    return { weightGrams: 0, band: null, zone: 'standard', baseFee: 0, surcharge: 0, freeCredit: 0, fee: 0, requiresQuote: false, method };
  }

  // Too heavy to price automatically — a wholesale-sized order is a conversation,
  // not a checkout. Returning requiresQuote stops the order rather than guessing.
  if (weightGrams > quoteAbove) {
    return { weightGrams, band: null, zone: exports.zoneForPostcode(address.postal_code ?? address.postalCode ?? address.zip), baseFee: 0, surcharge: 0, freeCredit: 0, fee: 0, requiresQuote: true, method };
  }

  const band = bands.find((b) => weightGrams <= b.maxGrams) || bands[bands.length - 1];
  const baseFee = Number(band[method] || 0);

  const zone = exports.zoneForPostcode(address.postal_code ?? address.postalCode ?? address.zip);
  const zoneDef = shippingConfig.zones[zone] || shippingConfig.zones.standard;
  const surcharge = method === 'standard' ? Number(settings.remoteSurcharge ?? zoneDef.surcharge ?? 0) : 0;

  let fee = baseFee + surcharge;

  // Free shipping credits the HEADLINE standard rate (the "$8 anywhere in Australia"
  // the policy advertises) rather than the whole freight bill. So every ordinary
  // order — anything in the $8 band or below — really is free, exactly as promised,
  // while a bulky order pays only the excess and her exposure stays capped at $8.
  let freeCredit = 0;
  const threshold = Number(settings.freeShippingThreshold ?? 0);
  if (method === 'standard' && threshold > 0 && goodsPayable >= threshold) {
    const headlineRate = Number(settings.standardShippingPrice ?? 8);
    freeCredit = Math.min(fee, headlineRate);
    fee = round2(fee - freeCredit);
  }

  // Absolute backstop so a data error can never bill a customer hundreds.
  if (maxCharge > 0) fee = Math.min(fee, maxCharge);

  return { weightGrams, band: band.label, zone, baseFee, surcharge, freeCredit, fee: round2(Math.max(0, fee)), requiresQuote: false, method };
};
