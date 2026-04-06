const router = require('express').Router();
const settingsController = require('../controllers/settingsController');

router.route('/')
    .get(settingsController.getSettings)
    .put(settingsController.updateSettings);

module.exports = router;
