import taxonomy from './taxonomy.json';

export const categoryData = taxonomy.categories;
export const collections = taxonomy.collections;

// Single source of truth for the "Curated Collections" multi-select.
// `value` is the EXACT string the backend enum (taxonomy.json) validates against —
// sending anything else (e.g. a Title-Cased copy) fails Mongoose validation and the
// whole product save is rejected. `label` is the human-friendly display text only.
// Never hardcode these option strings inside components.
export const COLLECTION_OPTIONS = taxonomy.collections.map((value) => ({
  value,
  label: value.replace(/\b\w/g, (c) => c.toUpperCase()),
}));
