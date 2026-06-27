const router = require('express').Router();
const settingsController = require('../controllers/settingsController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

router.route('/')
    .get(settingsController.getSettings) // public: storefront needs shipping/GST/announcement
    .put(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), settingsController.updateSettings);

module.exports = router;
