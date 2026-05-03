const mongoose = require('mongoose');

const testimonialSchema = new mongoose.Schema(
    {
        clientName: {
            type: String,
            required: [true, 'Please provide the client name'],
        },
        location: {
            type: String,
        },
        image: {
            type: String,
            required: [true, 'Please provide an image URL'],
        },
        testimonial: {
            type: String,
        },
        rating: {
            type: Number,
            default: 5,
        },
        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
