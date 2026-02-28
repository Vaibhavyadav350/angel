const router = require('express').Router();

const paymentController = require('../controllers/paymentController');
const webhookController = require('../controllers/webhookController');
const express = require('express');

// creating checkout session
router.post('/create-checkout-session', paymentController);

module.exports = router;
