const router = require('express').Router();
const bannerController = require('../controllers/bannerController');

// For public access
router.route('/active').get(bannerController.getActiveBanners);

// For admin access (protection middleware will be added in server.js/adminRouter context if needed, or directly here if requested. For now, matching existing structure)
router.route('/')
    .get(bannerController.getAllBanners)
    .post(bannerController.createBanner);

router.route('/:id')
    .put(bannerController.updateBanner)
    .delete(bannerController.deleteBanner);

module.exports = router;
