const User = require("../models/User");
const Course = require("../models/Course");

exports.addToCart = async (req, res) => {
  try {
    // Validate incoming data
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required to be added to cart",
      });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found or is invalid",
      });
    }

    // Check if the course is already added to cart
    const userId = req.user.id;
    const userDetails = await User.findById({ _id: userId });

    if (userDetails.cartItems.includes(courseId._id)) {
      return res.status(403).json({
        success: false,
        message: "Course is already in cart",
      });
    }

    // Check if user has already purchased the course
    if (userDetails.courses.includes(courseId._id)) {
      return res.status(403).json({
        success: false,
        message: "Purchased course cannot be added to cart",
      });
    }

    // Add course to cart
    const updatedCart = await User.findByIdAndUpdate(
      { _id: userId },
      { $push: { cartItems: courseId } },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Course added to cart",
      data: updatedCart,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not add course to cart",
      error: error.message,
    });
  }
};

exports.removeFromCart = async (req, res) => {
  try {
    // Validate incoming data
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({
        success: false,
        message: "Course ID is required to remove course from cart",
      });
    }

    const courseDetails = await Course.findById(courseId);

    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Course not found or is invalid",
      });
    }

    const userId = req.user.id;
    const userDetails = await User.findById(userId);

    let updatedCourse;

    // Check if the course is added to cart
    if (userDetails.cartItems.includes(courseId._id)) {
      // Remove it from cart
      updatedCourse = await User.findByIdAndUpdate(
        { _id: userId },
        { $pull: { cartItems: courseId._id } },
        { new: true }
      );
    }

    // send response
    return res.status(200).json({
      success: true,
      message: "Course removed from cart",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not remove course from cart",
      error: error.message,
    });
  }
};

exports.getEntireCart = async (req, res) => {
  try {
    // get user id to get cart details
    const userId = req.user.id;

    // Get user details using uer Id
    const userDetails = await User.findById(userId).populate("cartItems");

    // Get total items in cart
    const totalItems = userDetails.cartItems.length;

    // Price of total Items
    const totalPrice = userDetails.cartItems.reduce((total, item) => {
      return total + item.price;
    }, 0);

    return res.status(200).json({
      success: true,
      message: "Cart details fetched successfully",
      data: { userDetails, totalItems, totalPrice },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Could not get Cart for user",
    });
  }
};

exports.resetCart = async (req, res) => {
  try {
    const userId = req.user.id;

    // Set the cartItems array to an empty array
    const updatedCart = await User.findByIdAndUpdate(
      { _id: userId },
      { $set: { cartItems: [] } },
      { new: true }
    );

    const totalItems = 0;
    const totalPrice = 0;

    return res.status(200).json({
      success: true,
      message: "Cart reset successfully",
      data: { updatedCart, totalItems, totalPrice },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Could not reset cart",
      error: error.message,
    });
  }
};
