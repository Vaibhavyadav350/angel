const router = require('express').Router();
const { paymentController } = require('../controllers/paymentController');

// Initiate RSP checkout — returns SharedPaymentUrl to redirect user to eWAY's hosted page
router.post('/create-checkout-session', paymentController);

// Note: GET /api/payment/callback is registered directly in server.js (before this router)
// and handled by webhookController. It does NOT go through this router.

module.exports = router;
