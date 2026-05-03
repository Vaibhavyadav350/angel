const router = require('express').Router();
const categoryController = require('../controllers/categoryController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

router.route('/active').get(categoryController.getActiveCategories);

router.route('/')
    .get(categoryController.getAllCategories)
    .post(isAuthenticatedAdmin, checkAdminPrivileges('admin'), categoryController.createCategory);

router.route('/:id')
    .put(isAuthenticatedAdmin, checkAdminPrivileges('admin'), categoryController.updateCategory)
    .delete(isAuthenticatedAdmin, checkAdminPrivileges('admin'), categoryController.deleteCategory);

module.exports = router;
