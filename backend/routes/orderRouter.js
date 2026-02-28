const router = require('express').Router();

const orderController = require('../controllers/orderController');

// Order creation is handled exclusively by the Stripe webhook (webhookController.js)
// No public REST endpoint for order creation — prevents duplicate orders and unauthorized access

// send user orders
router.route('/').post(orderController.getUserOrders);

// send single order
router.route('/:id').get(orderController.getSingleOrder);

// download invoice
router.route('/:id/invoice').get(orderController.getOrderInvoice);

// download packing slip
router.route('/:id/packingslip').get(orderController.getPackingSlip);

// request return
router.route('/:id/return').put(orderController.requestReturn);

module.exports = router;
