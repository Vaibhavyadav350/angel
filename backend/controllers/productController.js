const Product = require('../models/productModel');
const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/CatchAsyncErrors');
const cloudinary = require('../config/cloudinary');
const { notifySubscribers } = require('../controllers/restockController');

// create a new product
exports.createProduct = catchAsyncError(async (req, res, next) => {
  req.body.admin = req.user.id;
  let images = req.body.images;
  let newImages = [];
  for (let i = 0; i < images.length; i++) {
    const { public_id, url } = await cloudinary.uploader.upload(images[i], {
      folder: process.env.CLOUDINARY_FOLDER || 'angel-fashion-studio',
      fetch_format: 'auto',
      quality: 'auto'
    });
    newImages.push({ public_id, url });
  }
  req.body.images = [...newImages];

  // Calculate global stock from variants
  if (req.body.variants && Array.isArray(req.body.variants)) {
    req.body.stock = req.body.variants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0);
  }

  const product = await Product.create(req.body);

  console.info(`[CATALOG CREATION] New product structure added: ${product.name} (SKU: ${product._id}). Global Stock: ${product.stock}`);

  res.status(200).json({
    success: true,
    data: product,
  });
});

// update an existing product
exports.updateProduct = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product Not Found', 400));
  }
  let product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404));
  }
  let images = req.body.images;
  let newImages = [];
  for (let i = 0; i < images.length; i++) {
    if (typeof images[i] === 'string') {
      const { public_id, url } = await cloudinary.uploader.upload(images[i], {
        folder: process.env.CLOUDINARY_FOLDER || 'angel-fashion-studio',
        fetch_format: 'auto',
        quality: 'auto'
      });
      newImages.push({ public_id, url });
    } else {
      newImages.push(images[i]);
    }
  }
  req.body.images = [...newImages];

  // Recalculate global stock from variants on update
  if (req.body.variants && Array.isArray(req.body.variants)) {
    req.body.stock = req.body.variants.reduce((total, variant) => total + (Number(variant.stock) || 0), 0);
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
    // Removed deprecated useFindAndModify option
  });

  // If total stock was increased, notify subscribers (Simplified logic for now)
  if (req.body.stock && req.body.stock > 0) {
    await notifySubscribers(req.params.id);
  }

  console.info(`[CATALOG MUTATION] Product structure updated: ${product.name} (SKU: ${product._id}). New Global Stock: ${product.stock}`);

  res.status(200).json({
    success: true,
    data: product,
  });
});

// delete an existing product
exports.deleteProduct = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product Not Found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404));
  }
  for (let i = 0; i < product.images.length; i++) {
    await cloudinary.uploader.destroy(product.images[i].public_id);
  }
  await product.deleteOne();

  console.info(`[CATALOG DELETION] Product permanently removed from database: ${product.name} (SKU: ${product._id}).`);

  res.status(200).json({
    success: true,
    message: 'Product deleted',
  });
});

// send all product details
exports.getAllProducts = catchAsyncError(async (req, res) => {
  // Prevent memory explosion but allow client-side filtering max limit
  const products = await Product.find().limit(1000);
  // Transform for list view (frontend expects 'image' not 'images')
  const data = products.map((item) => {
    const {
      _id: id,
      name,
      price,
      images,
      colors,
      variants,
      company,
      description,
      category,
      stock,
      shipping,
      featured,
    } = item;
    return {
      id,
      name,
      price,
      image: images && images.length > 0 ? images[0].url : '',
      colors,
      variants: variants || [],
      company,
      description,
      category,
      subCategory: item.subCategory || '',
      productType: item.productType || '',
      collections: item.collections || [],
      stock,
      shipping,
      featured,
    };
  });
  res.status(200).json({
    success: true,
    data,
  });
});

// send only a single product details
exports.getSingleProduct = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product Not Found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product Not Found', 404));
  }
  res.status(200).json({
    success: true,
    data: product,
  });
});

// review a product
exports.createProductReview = catchAsyncError(async (req, res, next) => {
  const { rating, comment, productId, name, email } = req.body;
  if (!rating || !comment || !productId || !name || !email) {
    return next(new ErrorHandler('Request invalid', 400));
  }
  // creating a review
  const review = {
    name,
    email,
    rating: Number(rating),
    comment,
  };
  const product = await Product.findById(productId);
  // check if the user already reviewed
  const isReviewed = product.reviews.some((rev) => rev.email === email);
  // user already review: update the review
  // user gives new review: add new review and update the number of reviews
  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.email === email) {
        rev.name = name;
        rev.rating = rating;
        rev.comment = comment;
      }
    });
  } else {
    product.reviews.push(review);
    product.numberOfReviews = product.reviews.length;
  }
  // update product rating
  let avg = 0;
  product.reviews.forEach((rev) => {
    avg += rev.rating;
  });
  avg = product.reviews.length > 0 ? avg / product.reviews.length : 0;
  product.rating = avg;
  // save the product
  await product.save({ validateBeforeSave: false });
  // send success response
  res.status(200).json({
    success: true,
    message: 'Product review created',
  });
});

// send all product reviews
exports.getAllReviews = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product not found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  const reviews = product.reviews;
  res.status(200).json({
    success: true,
    data: reviews,
  });
});

// delete product review
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  if (!req.params.id) {
    return next(new ErrorHandler('Product not found', 400));
  }
  const { reviewId } = req.query;
  if (!reviewId) {
    return next(new ErrorHandler('Review not found', 400));
  }
  const product = await Product.findById(req.params.id);
  if (!product) {
    return next(new ErrorHandler('Product not found', 404));
  }
  const reviews = product.reviews.filter(
    (rev) => rev._id.toString() !== reviewId.toString()
  );
  let avg = 0;
  reviews.forEach((rev) => {
    avg += rev.rating;
  });
  avg = reviews.length > 0 ? avg / reviews.length : 0;
  const rating = avg || 0;
  const numberOfReviews = reviews.length;
  await Product.findByIdAndUpdate(
    req.params.id,
    {
      rating,
      numberOfReviews,
      reviews,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    success: true,
    message: 'Review deleted',
  });
});

// get trending products
exports.getTrendingProducts = catchAsyncError(async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 5;
  let products = await Product.find({ isTrending: true }).limit(limit);
  if (products.length < limit) {
    const fallback = await Product.find({ isTrending: false }).sort({ rating: -1, numberOfReviews: -1 }).limit(limit - products.length);
    products = [...products, ...fallback];
  }

  const data = products.map((item) => {
    return {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.images && item.images.length > 0 ? item.images[0].url : '',
      colors: item.colors,
      company: item.company,
      description: item.description,
      category: item.category,
      subCategory: item.subCategory || '',
      productType: item.productType || '',
      collections: item.collections || [],
      stock: item.stock,
      shipping: item.shipping,
      featured: item.featured,
    };
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// get new arrivals
exports.getNewArrivals = catchAsyncError(async (req, res, next) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 5;
  const products = await Product.find().sort({ createdAt: -1 }).limit(limit);

  const data = products.map((item) => {
    return {
      id: item._id,
      name: item.name,
      price: item.price,
      image: item.images && item.images.length > 0 ? item.images[0].url : '',
      colors: item.colors,
      company: item.company,
      description: item.description,
      category: item.category,
      subCategory: item.subCategory || '',
      productType: item.productType || '',
      collections: item.collections || [],
      stock: item.stock,
      shipping: item.shipping,
      featured: item.featured,
    };
  });

  res.status(200).json({
    success: true,
    data,
  });
});

// Export Products to Excel (Admin)
exports.exportProductsExcel = catchAsyncError(async (req, res, next) => {
  const products = await Product.find();
  const XLSX = require('xlsx');

  const data = products.map(p => ({
    SKU: p._id.toString(),
    Name: p.name,
    Category: p.category,
    Collection: p.company,
    Price: p.price,
    Stock: p.stock,
    Description: p.description.substring(0, 100) + '...',
    Featured: p.featured ? 'Yes' : 'No'
  }));

  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.json_to_sheet(data);
  XLSX.utils.book_append_sheet(workbook, worksheet, "Inventory");

  const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=inventory_archive.xlsx');
  res.send(buffer);
});
