require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/productModel');

async function updateProduct() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB');
    
    // Find a product, e.g. a Kurta
    const product = await Product.findOne({ subCategory: 'KURTAS' });
    if (!product) {
      console.log('No Kurta found');
      process.exit();
    }
    
    console.log('Updating product:', product.name);
    
    product.sizes = ['M', 'L', 'XL'];
    product.colors = ['Ochre Gold', 'Emerald Green'];
    
    product.variants = [
      { size: 'M', color: 'Ochre Gold', stock: 5 },
      { size: 'L', color: 'Ochre Gold', stock: 2 },
      { size: 'XL', color: 'Ochre Gold', stock: 0 }, // Out of stock example
      { size: 'M', color: 'Emerald Green', stock: 3 },
      { size: 'L', color: 'Emerald Green', stock: 0 },
      { size: 'XL', color: 'Emerald Green', stock: 1 },
    ];
    
    product.stock = product.variants.reduce((acc, curr) => acc + curr.stock, 0);
    
    await product.save();
    console.log('Product updated successfully!');
  } catch (err) {
    console.error(err);
  } finally {
    process.exit();
  }
}

updateProduct();
