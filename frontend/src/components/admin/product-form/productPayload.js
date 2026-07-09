/**
 * Shared validation + payload construction for the product Create/Edit modals,
 * so both submit the exact same shape to the API.
 */
import { colorOptions, sizeOptions } from '../../../utils/categoryData';

const validColorNames = colorOptions.map((c) => c.name);
const validSizeNames = sizeOptions;

export function validateProduct(form, imageList) {
  const { name, price, description, category, subCategory, company, colors = [], sizes = [] } = form;
  const variants = form.variants || [];
  if (!name || !price || !description || !category || !subCategory || !company) {
    return 'Please provide all primary details';
  }
  if (variants.length === 0) {
    return 'Please add at least one color or size to generate inventory variants.';
  }
  if (!imageList || imageList.length < 1) {
    return 'Add at least one image';
  }
  const invalidColors = colors.filter((c) => !validColorNames.includes(c));
  if (invalidColors.length > 0) {
    return `Invalid colour(s): ${invalidColors.join(', ')}. Use the standard palette.`;
  }
  const invalidSizes = sizes.filter((s) => !validSizeNames.includes(s));
  if (invalidSizes.length > 0) {
    return `Invalid size(s): ${invalidSizes.join(', ')}. Use the standard size taxonomy.`;
  }
  return null;
}

export function buildProductPayload(form, imageList) {
  const variants = form.variants || [];
  const totalStock = variants.reduce((total, v) => total + (Number(v.stock) || 0), 0);
  return {
    name: form.name,
    price: form.price,
    stock: totalStock,
    description: form.description,
    colors: form.colors || [],
    sizes: form.sizes || [],
    variants,
    category: form.category,
    subCategory: form.subCategory,
    productType: form.productType || '',
    collections: form.collections || [],
    company: form.company,
    shipping: !!form.shipping,
    featured: !!form.featured,
    discountPercent: Number(form.discountPercent) || 0,
    images: imageList,
    badgeText: form.badgeText || '',
    leadTimeDays: form.leadTimeDays || 0,
    composition: form.composition || '',
    careInstructions: form.careInstructions || '',
  };
}
