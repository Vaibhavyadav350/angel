const router = require('express').Router();
const featuredCollectionController = require('../controllers/featuredCollectionController');

router.route('/active').get(featuredCollectionController.getActiveCollections);

router.route('/')
    .get(featuredCollectionController.getAllCollections)
    .post(featuredCollectionController.createCollection);

router.route('/:id')
    .put(featuredCollectionController.updateCollection)
    .delete(featuredCollectionController.deleteCollection);

module.exports = router;
