const router = require('express').Router();

const orderController = require('../controllers/orderController');
const { isAuthenticatedCustomer } = require('../middleware/customerAuth');

// Order creation is handled exclusively by the eWAY callback (webhookController.js)
// No public REST endpoint for order creation — prevents duplicate orders and unauthorized access

// send user orders
router.route('/').post(isAuthenticatedCustomer, orderController.getUserOrders);

// send single order
router.route('/:id').get(isAuthenticatedCustomer, orderController.getSingleOrder);

// download invoice
router.route('/:id/invoice').get(isAuthenticatedCustomer, orderController.getOrderInvoice);

// request return
router.route('/:id/return').put(isAuthenticatedCustomer, orderController.requestReturn);

module.exports = router;
