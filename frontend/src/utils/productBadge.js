// ---------------------------------------------------------------------------
// Product card badge.
//
// The badge used to come from a free-text `badgeText` box in the admin, which
// printed whatever was typed straight onto the card. In practice that produced
// "Online", "15", "Premium Collection" and "ETHNIC WEAR" across 13 products.
//
// The badge is now derived from the Curated Collections checkboxes the owner
// already ticks, so there is nothing extra to type and nothing to get wrong.
// A product can sit in several collections, so the first match in this list
// wins — Sale outranks New Arrival, and so on down.
// ---------------------------------------------------------------------------

export const BADGE_PRIORITY = [
  { collection: 'sale', label: 'SALE', tone: 'sale' },
  { collection: 'new arrivals', label: 'NEW ARRIVAL', tone: 'accent' },
  { collection: 'best sellers', label: 'BEST SELLER', tone: 'accent' },
  { collection: 'ready to ship', label: 'READY TO SHIP', tone: 'neutral' },
  { collection: 'plus sizes', label: 'PLUS SIZES', tone: 'neutral' },
];

/**
 * The single badge to show for a product, or null when it belongs to no
 * collection.
 *
 * `activeCollection` is the collection the shopper is currently browsing. On the
 * New Arrivals page, "New Arrival" is the relevant label even when the product
 * is also on sale — a global priority order alone put a SALE badge on the New
 * Arrivals page, which reads as a mapping error. 55 of 58 products sit in more
 * than one collection, so this is the common case, not an edge one.
 *
 * With no collection filter active, fall back to the priority order.
 */
export const productBadge = (product = {}, { activeCollection } = {}) => {
  const owned = (product.collections || []).map((c) => String(c).trim().toLowerCase());
  if (owned.length === 0) return null;

  const active = String(activeCollection || '').trim().toLowerCase();
  if (active && active !== 'all' && owned.includes(active)) {
    const contextual = BADGE_PRIORITY.find((b) => b.collection === active);
    if (contextual) return { label: contextual.label, tone: contextual.tone };
  }

  const match = BADGE_PRIORITY.find((b) => owned.includes(b.collection));
  return match ? { label: match.label, tone: match.tone } : null;
};

/** Tailwind classes per tone, so every surface renders a badge identically. */
export const BADGE_TONE_CLASSES = {
  sale: 'bg-[#B3261E] text-white',
  accent: 'bg-gold text-chocolate',
  neutral: 'bg-chocolate/85 text-champagne',
};
