const router = require('express').Router();
const { paymentController, callbackController } = require('../controllers/paymentController');

// Direct payment / Responsive Shared Page initiation
router.post('/create-checkout-session', paymentController);

// eWAY callback after RSP or 3DS completion
// eWAY redirects here with ?AccessCode=xxx after user completes payment on hosted page
router.get('/callback', callbackController);

module.exports = router;
