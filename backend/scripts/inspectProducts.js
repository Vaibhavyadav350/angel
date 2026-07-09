require('dotenv').config();
const fs = require('fs');
const path = require('path');
const connectToDb = require('../config/db');

const Product = require('../models/productModel');
const Order = require('../models/orderModel');
const Category = require('../models/categoryModel');
const UserProfile = require('../models/userProfileModel');
const Newsletter = require('../models/newsletterModel');
const Testimonial = require('../models/testimonialModel');
const Restock = require('../models/restockModel');
const PendingCheckout = require('../models/pendingCheckoutModel');
const Coupon = require('../models/couponModel');
const Banner = require('../models/bannerModel');
const FeaturedCollection = require('../models/featuredCollectionModel');
const Settings = require('../models/settingsModel');

const taxonomy = require('../../frontend/src/utils/taxonomy.json');

const validCategories = Object.keys(taxonomy.categories);
const validSubCategories = [];
const validProductTypes = [];
Object.values(taxonomy.categories).forEach((subCatObj) => {
  Object.keys(subCatObj).forEach((sub) => {
    validSubCategories.push(sub);
    subCatObj[sub].forEach((t) => validProductTypes.push(t));
  });
});
const validCollections = taxonomy.collections || [];
const validColors = (taxonomy.colors || []).map((c) => c.name);
const validSizes = taxonomy.sizes || [];

function uniq(arr) {
  return [...new Set(arr)];
}

async function main() {
  await connectToDb();

  console.log('\n=== Collection counts ===');
  const counts = {
    products: await Product.countDocuments(),
    orders: await Order.countDocuments(),
    categories: await Category.countDocuments(),
    userProfiles: await UserProfile.countDocuments(),
    newsletters: await Newsletter.countDocuments(),
    testimonials: await Testimonial.countDocuments(),
    restocks: await Restock.countDocuments(),
    pendingCheckouts: await PendingCheckout.countDocuments(),
    coupons: await Coupon.countDocuments(),
    banners: await Banner.countDocuments(),
    featuredCollections: await FeaturedCollection.countDocuments(),
    settings: await Settings.countDocuments(),
  };
  console.table(counts);

  const products = await Product.find().lean();
  console.log(`\nFetched ${products.length} products`);

  const invalid = {
    category: [],
    subCategory: [],
    productType: [],
    colors: [],
    sizes: [],
    collections: [],
    variantsColor: [],
    variantsSize: [],
    badgeText: [],
  };

  products.forEach((p) => {
    if (!validCategories.includes(p.category)) invalid.category.push(`${p._id}: ${p.category}`);
    if (!validSubCategories.includes(p.subCategory)) invalid.subCategory.push(`${p._id}: ${p.subCategory}`);
    if (p.productType && !validProductTypes.includes(p.productType)) invalid.productType.push(`${p._id}: ${p.productType}`);
    (p.colors || []).forEach((c) => {
      if (!validColors.includes(c)) invalid.colors.push(`${p._id}: ${c}`);
    });
    (p.sizes || []).forEach((s) => {
      if (!validSizes.includes(s)) invalid.sizes.push(`${p._id}: ${s}`);
    });
    (p.collections || []).forEach((c) => {
      if (!validCollections.includes(c)) invalid.collections.push(`${p._id}: ${c}`);
    });
    (p.variants || []).forEach((v, i) => {
      if (!validColors.includes(v.color)) invalid.variantsColor.push(`${p._id}#${i}: ${v.color}`);
      if (!validSizes.includes(v.size)) invalid.variantsSize.push(`${p._id}#${i}: ${v.size}`);
    });
    if (p.badgeText) invalid.badgeText.push(`${p._id}: "${p.badgeText}"`);
  });

  console.log('\n=== Invalid / non-standard values found ===');
  Object.entries(invalid).forEach(([key, list]) => {
    if (list.length) {
      console.log(`\n${key} (${list.length}):`);
      list.forEach((x) => console.log('  -', x));
    }
  });

  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const csvPath = path.join(dataDir, 'products_export_raw.csv');
  const headers = [
    '_id',
    'name',
    'category',
    'subCategory',
    'productType',
    'colors',
    'sizes',
    'collections',
    'variants',
    'badgeText',
    'featured',
    'price',
    'stock',
    'discountPercent',
    'imageCount',
    'firstImageUrl',
    'createdAt',
  ];
  const escape = (str) => `"${String(str ?? '').replace(/"/g, '""')}"`;
  const rows = products.map((p) =>
    [
      p._id,
      escape(p.name),
      escape(p.category),
      escape(p.subCategory),
      escape(p.productType),
      escape((p.colors || []).join('|')),
      escape((p.sizes || []).join('|')),
      escape((p.collections || []).join('|')),
      escape(JSON.stringify(p.variants || [])),
      escape(p.badgeText),
      p.featured,
      p.price,
      p.stock,
      p.discountPercent,
      (p.images || []).length,
      escape((p.images || [])[0]?.url || ''),
      p.createdAt,
    ].join(',')
  );
  fs.writeFileSync(csvPath, [headers.join(','), ...rows].join('\n'));
  console.log(`\nExported raw products CSV: ${csvPath}`);

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
