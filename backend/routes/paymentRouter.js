const router = require('express').Router();

const paymentController = require('../controllers/paymentController');

// creating checkout session (eWAY Responsive Shared Page)
router.post('/create-checkout-session', paymentController);

module.exports = router;
