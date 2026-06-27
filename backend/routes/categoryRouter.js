const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

router.route('/active').get(categoryController.getActiveCategories);

router.route('/')
    .get(categoryController.getAllCategories)
    .post(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), categoryController.createCategory);

router.route('/:id')
    .put(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), categoryController.updateCategory)
    .delete(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), categoryController.deleteCategory);

module.exports = router;
