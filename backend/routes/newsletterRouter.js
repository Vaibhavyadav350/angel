const router = require('express').Router();
const newsletterController = require('../controllers/newsletterController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

router.route('/subscribe').post(newsletterController.subscribe);

// Admin Routes
router.route('/')
    .get(isAuthenticatedAdmin, checkAdminPrivileges('low', 'moderate', 'super'), newsletterController.getAllSubscribers);

router.route('/:id')
    .delete(isAuthenticatedAdmin, checkAdminPrivileges('super'), newsletterController.deleteSubscriber);

module.exports = router;
