const router = require('express').Router();

const productController = require('../controllers/productController');

// send all product detaisl
router.route('/').get(productController.getAllProducts);

// get dynamic collections
router.route('/new-arrivals').get(productController.getNewArrivals);

// product counts per cloth, for the home page strip
router.route('/fabric-counts').get(productController.getFabricCounts);

// send a single product
// NOTE: keep every literal path above this line, or it matches here as an id.
router.route('/:id').get(productController.getSingleProduct);

// create product review
router.route('/reviews').post(productController.createProductReview);

// send all product reviews
router.route('/reviews/:id').get(productController.getAllReviews);

module.exports = router;
