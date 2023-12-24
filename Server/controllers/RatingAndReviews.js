const { default: mongoose } = require("mongoose");
const Course = require("../models/Course");
const RatingAndReviews = require("../models/RatingAndReview");
const User = require("../models/User");

// Create rating
exports.createRating = async (req, res) => {
  try {
    // get user ID for giving a rating
    const userId = req.user.id;

    // Fetch data from req body
    const { courseId, rating, review } = req.body;

    // Check if user is enrolled or not
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEntrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Please enroll in the course to give review",
      });
    }

    // Check if user has already reviewed the course
    const alreadyReviewed = await RatingAndReviews.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user",
      });
    }

    // Create Rating and review
    const ratingReview = await RatingAndReviews.create({
      rating,
      review,
      user: userId,
      course: courseId,
    });

    // Add the ratigs and reviews to the course
    await Course.findByIdAndUpdate(
      { _id: courseId },
      {
        $push: {
          ratingAndReviews: ratingReview._id,
        },
      },
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "rating and review added successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while adding rating and reviews",
    });
  }
};

// getAverageRating
exports.getAverageRating = async (req, res) => {
  try {
    // get course ID
    const { courseId } = req.body;

    // calculate avg rating
    const result = await RatingAndReviews.aggregate([
      {
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        $group: {
          _id: null,
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    // Return avg rating
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        averageRating: result[0].averageRating,
      });
    }

    // if no rating and reviews
    return res.status(200).json({
      success: true,
      message: "No ratings till now",
      averageRating: 0,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching avg rating",
    });
  }
};

// getAllRatings
exports.getAllRating = async (req, res) => {
  try {
    const allReviews = await RatingAndReviews.find({})
      .sort({ rating: "desc" })
      .populate({
        path: "user",
        select: "firstName lastName email image",
      })
      .populate({
        path: "course",
        select: "courseName",
      })
      .exec();

    return res.status(200).json({
      success: true,
      message: "All rating and reviews fetched successfully",
      data: allReviews,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while fetching all rating and review",
    });
  }
};
