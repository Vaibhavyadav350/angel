const express = require('express');
const router = express.Router();
const { subscribeToRestock } = require('../controllers/restockController');

router.route('/subscribe').post(subscribeToRestock);

module.exports = router;
