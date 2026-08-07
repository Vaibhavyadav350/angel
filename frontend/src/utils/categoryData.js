import taxonomy from './taxonomy.json';

export const categoryData = taxonomy.categories;
export const collections = taxonomy.collections;
export const colorOptions = taxonomy.colors || [];
export const sizeOptions = taxonomy.sizes || [];

// Cloth / silhouette. Optional, and at most one per product — a garment is not
// "silk and velvet and net". Drives the home page circles.
export const fabricOptions = taxonomy.fabrics || [];

// Categories where a size makes no sense (jewellery). These were stored as
// "M" / "Free Size" / "One Size" interchangeably because the product form
// demanded a size for everything; they are now a single "One Size".
export const SIZELESS_CATEGORIES = taxonomy.sizeless_categories || [];
export const SIZELESS_VALUE = 'One Size';
export const isSizelessCategory = (category) =>
  SIZELESS_CATEGORIES.some((c) => String(c).toLowerCase() === String(category || '').toLowerCase());

const allSubCategories = Object.values(taxonomy.categories).flatMap((subCats) =>
  Object.keys(subCats)
);

const allProductTypes = Object.values(taxonomy.categories).flatMap((subCats) =>
  Object.values(subCats).flatMap((types) => types)
);

// Single source of truth for the "Curated Collections" multi-select.
// `value` is the EXACT string the backend enum (taxonomy.json) validates against —
// sending anything else (e.g. a Title-Cased copy) fails Mongoose validation and the
// whole product save is rejected. `label` is the human-friendly display text only.
// Never hardcode these option strings inside components.
export const COLLECTION_OPTIONS = taxonomy.collections.map((value) => ({
  value,
  label: value.replace(/\b\w/g, (c) => c.toUpperCase()),
}));

/**
 * Normalize a URL filter value to the canonical taxonomy casing.
 * The storefront accepts links with mixed/title casing (e.g. ?subCategory=Lehengas),
 * but the sidebar UI and productType lookups need the exact key from taxonomy.json.
 * Returns the canonical value if found, otherwise returns the original value.
 */
export const normalizeFilterValue = (filterName, value) => {
  if (!value || value === 'all') return 'all';

  let pool;
  switch (filterName) {
    case 'category':
      pool = Object.keys(taxonomy.categories);
      break;
    case 'subCategory':
      pool = allSubCategories;
      break;
    case 'productType':
      pool = allProductTypes;
      break;
    case 'collection':
      pool = taxonomy.collections;
      break;
    case 'fabric':
      pool = taxonomy.fabrics || [];
      break;
    default:
      return value;
  }

  const match = pool.find((item) => item.toLowerCase() === value.toLowerCase());
  return match || value;
};

// ---------------------------------------------------------------------------
// Colour swatches
//
// Swatches were rendered with `style={{ background: colorName }}`, passing the
// NAME straight to CSS. Only names that happen to be CSS keywords showed up, so
// "Emerald Green", "Off-White", "Navy Blue", "Sky Blue", "Rust", "Copper" and
// "Multicolour" drew as invisible transparent circles. The ones that did render
// used the CSS keyword, not the brand value — CSS `red` is #FF0000, ours is
// #C62828 — so no swatch on the site matched the palette.
//
// Always resolve through this helper.
// ---------------------------------------------------------------------------
const COLOR_HEX = Object.fromEntries(
  colorOptions.filter((c) => c.hex).map((c) => [String(c.name).toLowerCase(), c.hex])
);

/** CSS background for a palette colour name. Handles the two entries with no hex. */
export const colorSwatch = (name) => {
  const key = String(name || '').trim().toLowerCase();
  if (COLOR_HEX[key]) return COLOR_HEX[key];
  if (key === 'multicolour' || key === 'multicolor') {
    return 'conic-gradient(#C62828, #F9A825, #2E7D32, #1565C0, #6A1B9A, #C62828)';
  }
  if (key === 'standard' || !key) return '#D4C5A9';
  // Unknown value: fall back to the raw name so a valid CSS keyword still works.
  return name;
};

/** True for pale swatches that need a darker outline to be visible on champagne. */
export const isPaleColor = (name) => {
  const hex = COLOR_HEX[String(name || '').trim().toLowerCase()];
  if (!hex) return false;
  const n = parseInt(hex.slice(1), 16);
  const [r, g, b] = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  // Perceived luminance.
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255 > 0.82;
};
