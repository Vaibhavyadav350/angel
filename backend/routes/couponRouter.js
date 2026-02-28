const router = require('express').Router();
const couponController = require('../controllers/couponController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

// Public route for checkout validation
router.route('/validate').post(couponController.validateCoupon);

// Admin routes
router.route('/')
    .get(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), couponController.getAllCoupons)
    .post(isAuthenticatedAdmin, checkAdminPrivileges('super'), couponController.createCoupon);

router.route('/:id')
    .delete(isAuthenticatedAdmin, checkAdminPrivileges('super'), couponController.deleteCoupon);

module.exports = router;
