require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const connectToDb = require('../config/db');

const Product = require('../models/productModel');
const Order = require('../models/orderModel');

const taxonomy = require('../../frontend/src/utils/taxonomy.json');

const validCategories = Object.keys(taxonomy.categories);
const validSubCategories = [];
const validProductTypes = [];
const productTypesBySubCategory = {};
Object.entries(taxonomy.categories).forEach(([cat, subCatObj]) => {
  Object.entries(subCatObj).forEach(([sub, types]) => {
    validSubCategories.push(sub);
    productTypesBySubCategory[sub] = types;
    types.forEach((t) => validProductTypes.push(t));
  });
});
const validCollections = taxonomy.collections || [];
const validColors = (taxonomy.colors || []).map((c) => c.name);
const validSizes = taxonomy.sizes || [];

const colorMap = {
  multi: 'Multicolour',
  multicolore: 'Multicolour',
  multicolor: 'Multicolour',
  'onion pink': 'Pink',
  'aqua green': 'Green',
  'hot pink': 'Pink',
  mehroon: 'Maroon',
  'bottle green': 'Green',
  'light pink': 'Pink',
  'navy blue': 'Navy Blue',
  black: 'Black',
  green: 'Green',
  red: 'Red',
  yellow: 'Yellow',
  blue: 'Blue',
  purple: 'Purple',
  gold: 'Gold',
};

const sizeMap = {
  'free size': 'Free Size',
  'one size': 'One Size',
  xs: 'XS',
  s: 'S',
  m: 'M',
  l: 'L',
  xl: 'XL',
  '2xl': '2XL',
  '3xl': '3XL',
  '4xl': '4XL',
  standard: 'Standard',
};

function normalizeColor(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  if (value.includes('&') || value.includes(',')) return 'Multicolour';
  const lower = value.toLowerCase();
  if (colorMap[lower]) return colorMap[lower];
  const canonical = validColors.find((c) => c.toLowerCase() === lower);
  if (canonical) return canonical;
  // Final fallback to keep the import valid
  return 'Multicolour';
}

function normalizeSize(raw) {
  const value = String(raw || '').trim();
  if (!value) return null;
  const parts = value.split(/\s+/);
  if (parts.length > 1) {
    // Composite size strings like "S M" or "S M L XL" are ambiguous;
    // treat them as Free Size to avoid inflating stock across invented variants.
    return 'Free Size';
  }
  const lower = value.toLowerCase();
  if (sizeMap[lower]) return sizeMap[lower];
  const canonical = validSizes.find((s) => s.toLowerCase() === lower);
  if (canonical) return canonical;
  return 'Free Size';
}

function normalizeProductType(raw, subCategory) {
  const value = String(raw || '').trim();
  if (!value) return '';
  if (validProductTypes.includes(value)) return value;
  const lower = value.toLowerCase();
  const caseMatch = validProductTypes.find((t) => t.toLowerCase() === lower);
  if (caseMatch) return caseMatch;
  const allowed = productTypesBySubCategory[subCategory] || [];
  if (lower.includes('bridal') && allowed.includes('Bridal Lehengas')) return 'Bridal Lehengas';
  if ((lower.includes('party') || lower.includes('bridesmaid')) && allowed.includes('Partywear Lehengas')) {
    return 'Partywear Lehengas';
  }
  if (lower.includes('indowestern') && allowed.includes('Indowestern')) return 'Indowestern';
  return allowed[0] || '';
}

function cleanBadge(text) {
  if (!text) return '';
  const t = String(text).trim();
  if (/bespoke|custom\s*stitch/i.test(t)) return '';
  return t;
}

function dedupeVariants(variants) {
  const map = new Map();
  variants.forEach((v) => {
    const key = `${v.size}|${v.color}`;
    if (map.has(key)) {
      map.get(key).stock += v.stock || 0;
    } else {
      map.set(key, { ...v });
    }
  });
  return Array.from(map.values());
}

function buildCleanProduct(product) {
  const cleaned = { ...product };

  // Normalize variants first; everything else derives from them.
  const rawVariants = Array.isArray(product.variants) ? product.variants : [];
  const normalizedVariants = dedupeVariants(
    rawVariants
      .map((v) => {
        const color = normalizeColor(v.color);
        const size = normalizeSize(v.size);
        if (!color || !size) return null;
        return {
          size,
          color,
          stock: Number(v.stock) || 0,
          sku: v.sku || '',
        };
      })
      .filter(Boolean)
  );

  if (normalizedVariants.length === 0) {
    // If there are no usable variants, create a single default one from top-level color/size.
    const color = normalizeColor((product.colors || [])[0]);
    const size = normalizeSize((product.sizes || [])[0]);
    if (color && size) {
      normalizedVariants.push({ size, color, stock: Number(product.stock) || 0, sku: '' });
    }
  }

  cleaned.variants = normalizedVariants;
  cleaned.colors = uniq(normalizedVariants.map((v) => v.color));
  cleaned.sizes = uniq(normalizedVariants.map((v) => v.size));
  cleaned.stock = normalizedVariants.reduce((sum, v) => sum + (v.stock || 0), 0);

  cleaned.category = validCategories.includes(product.category) ? product.category : validCategories[0];
  cleaned.subCategory = validSubCategories.includes(product.subCategory)
    ? product.subCategory
    : Object.keys(productTypesBySubCategory)[0];
  cleaned.productType = normalizeProductType(product.productType, cleaned.subCategory);

  cleaned.collections = (product.collections || []).filter((c) => validCollections.includes(c));

  cleaned.badgeText = cleanBadge(product.badgeText);

  if (!product.company || String(product.company).trim() === '') {
    cleaned.company = 'Angel Fashion Studio';
  }

  return cleaned;
}

function uniq(arr) {
  return [...new Set(arr)];
}

async function main() {
  const dryRun = process.env.DRY_RUN !== 'false' && process.env.DRY_RUN !== '0';
  await connectToDb();

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const products = await Product.find().lean();
  const orders = await Order.find().lean();

  console.log(`Products: ${products.length}`);
  console.log(`Orders to delete: ${orders.length}`);

  // Backups
  fs.writeFileSync(path.join(dataDir, `products_backup_${timestamp}.json`), JSON.stringify(products, null, 2));
  fs.writeFileSync(path.join(dataDir, `orders_backup_${timestamp}.json`), JSON.stringify(orders, null, 2));
  console.log(`Backups written to ${dataDir}`);

  const cleanedProducts = products.map(buildCleanProduct);

  console.log('\n=== Proposed product changes ===');
  products.forEach((original, i) => {
    const cleaned = cleanedProducts[i];
    const changes = [];
    if (JSON.stringify(original.colors) !== JSON.stringify(cleaned.colors)) changes.push(`colors: ${JSON.stringify(original.colors)} → ${JSON.stringify(cleaned.colors)}`);
    if (JSON.stringify(original.sizes) !== JSON.stringify(cleaned.sizes)) changes.push(`sizes: ${JSON.stringify(original.sizes)} → ${JSON.stringify(cleaned.sizes)}`);
    if (JSON.stringify(original.variants) !== JSON.stringify(cleaned.variants)) changes.push(`variants: ${original.variants.length} → ${cleaned.variants.length} normalized`);
    if (original.productType !== cleaned.productType) changes.push(`productType: ${original.productType} → ${cleaned.productType}`);
    if (original.badgeText !== cleaned.badgeText) changes.push(`badgeText: "${original.badgeText}" → "${cleaned.badgeText}"`);
    if (original.stock !== cleaned.stock) changes.push(`stock: ${original.stock} → ${cleaned.stock}`);
    if (original.company !== cleaned.company) changes.push(`company: "${original.company}" → "${cleaned.company}"`);
    if (changes.length) {
      console.log(`\n${original.name} (${original._id})`);
      changes.forEach((c) => console.log('  -', c));
    }
  });

  if (dryRun) {
    console.log('\n[DRY RUN] No changes were saved. Set DRY_RUN=false to apply.');
    process.exit(0);
  }

  console.log('\nApplying product updates...');
  for (const cleaned of cleanedProducts) {
    const { _id, ...update } = cleaned;
    await Product.findByIdAndUpdate(_id, update, { runValidators: true });
  }
  console.log(`Updated ${cleanedProducts.length} products`);

  console.log('Deleting orders...');
  const { deletedCount } = await Order.deleteMany({});
  console.log(`Deleted ${deletedCount} orders`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
