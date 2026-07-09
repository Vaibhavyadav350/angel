const mongoose = require('mongoose');
const Product = require('./models/productModel');
require('dotenv').config();

async function checkJewelryProducts() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB.');

    const products = await Product.find({ category: 'Jewelry' });
    console.log(`Found ${products.length} Jewelry products.`);
    
    let needsFixing = 0;
    
    products.forEach((p, idx) => {
      console.log(`\n--- Product ${idx + 1}: ${p.name} ---`);
      console.log(`Sizes:`, p.sizes);
      console.log(`Colors:`, p.colors);
      console.log(`Variants:`, p.variants.map(v => ({ size: v.size, color: v.color, stock: v.stock })));
      
      if (p.sizes.length > 0 || p.colors.length > 0 || p.variants.length > 1 || (p.variants.length === 1 && (p.variants[0].size !== 'One Size' || p.variants[0].color !== 'Standard'))) {
        needsFixing++;
      }
    });
    
    console.log(`\nProducts needing migration: ${needsFixing}`);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
  }
}

checkJewelryProducts();
