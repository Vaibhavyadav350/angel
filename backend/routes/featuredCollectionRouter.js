const router = require('express').Router();
const featuredCollectionController = require('../controllers/featuredCollectionController');
const { isAuthenticatedAdmin, checkAdminPrivileges } = require('../middleware/Auth');

router.route('/active').get(featuredCollectionController.getActiveCollections);

// Reads are open; mutations require an authenticated admin (moderate/super)
router.route('/')
    .get(featuredCollectionController.getAllCollections)
    .post(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), featuredCollectionController.createCollection);

router.route('/:id')
    .put(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), featuredCollectionController.updateCollection)
    .delete(isAuthenticatedAdmin, checkAdminPrivileges('moderate', 'super'), featuredCollectionController.deleteCollection);

module.exports = router;
