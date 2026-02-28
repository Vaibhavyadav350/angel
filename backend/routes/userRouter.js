const express = require('express');
const router = express.Router();
const { getUserProfile, toggleWishlist, getAllProfiles } = require('../controllers/userController');
const { isAuthenticatedAdmin } = require('../middleware/Auth');

router.route('/profile').get(getUserProfile);
router.route('/wishlist/toggle').post(toggleWishlist);
router.route('/admin/all').get(isAuthenticatedAdmin, getAllProfiles);

module.exports = router;
