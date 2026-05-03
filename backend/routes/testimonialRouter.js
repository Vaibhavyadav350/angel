const router = require('express').Router();
const testimonialController = require('../controllers/testimonialController');

router.route('/featured').get(testimonialController.getFeaturedTestimonials);

router.route('/')
    .get(testimonialController.getAllTestimonials)
    .post(testimonialController.createTestimonial);

router.route('/:id')
    .put(testimonialController.updateTestimonial)
    .delete(testimonialController.deleteTestimonial);

module.exports = router;
