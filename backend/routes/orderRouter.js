const router = require('express').Router();

const orderController = require('../controllers/orderController');

// create new order
router.route('/new').post(orderController.createNewOrder);

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
