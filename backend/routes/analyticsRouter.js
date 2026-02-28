const router = require('express').Router();
const analyticsController = require('../controllers/analyticsController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

router.use(isAuthenticatedAdmin);

router.route('/sales').get(checkAdminPrivileges('moderate', 'super'), analyticsController.getSalesStats);
router.route('/categories').get(checkAdminPrivileges('moderate', 'super'), analyticsController.getCategoryStats);
router.route('/kpis').get(checkAdminPrivileges('moderate', 'super'), analyticsController.getDashboardKPIs);

module.exports = router;
