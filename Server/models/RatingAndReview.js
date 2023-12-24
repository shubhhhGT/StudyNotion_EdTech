// import mongoose for creating a schema
const mongoose = require('mongoose');

// Create and export the schema
const ratingAndReviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        rating: {
            type: Number,
            required: true,
        },
        review: {
            type: String,
            required: true,
            trim: true,
        },
        course: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Course',
            index: true,
        }
    }
)

module.exports = mongoose.model('RatingAndReview', ratingAndReviewSchema);