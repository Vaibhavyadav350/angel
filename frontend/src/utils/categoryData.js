import taxonomy from './taxonomy.json';

export const categoryData = taxonomy.categories;
export const collections = taxonomy.collections;

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
    default:
      return value;
  }

  const match = pool.find((item) => item.toLowerCase() === value.toLowerCase());
  return match || value;
};
