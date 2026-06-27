const router = require('express').Router();
const bannerController = require('../controllers/bannerController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

// For public access
router.route('/active').get(bannerController.getActiveBanners);

// Reads are open; mutations require an authenticated admin (moderate/super)
router.route('/')
    .get(bannerController.getAllBanners)
    .post(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), bannerController.createBanner);

router.route('/:id')
    .put(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), bannerController.updateBanner)
    .delete(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), bannerController.deleteBanner);

module.exports = router;
