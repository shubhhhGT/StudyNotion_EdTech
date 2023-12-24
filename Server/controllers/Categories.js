const Category = require("../models/Category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// Create category
exports.createCategory = async (req, res) => {
  try {
    // Get data from req body
    const { name, description } = req.body;

    // validation
    if (!name || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Create a entry in DB
    const categoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(categoryDetails);

    // return response
    return res.status(200).json({
      success: true,
      message: "category created successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while creating category, please try again",
    });
  }
};

// Get all category
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All categories returned successfully",
      allCategories,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    // get category ID
    const { categoryId } = req.body;

    // get courses for specified course ID
    const selectedCategory = await Category.findById({ _id: categoryId })
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    // validation
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "data not found",
      });
    }

    // get courses for different categories
    const differentCategoriesExceptSelected = await Category.find({
      _id: { $ne: categoryId },
    })
      .populate("course")
      .exec();

    // Randomly select one category from all the categories except selected one
    let differentCategory = await Category.find(
      differentCategoriesExceptSelected[
        getRandomInt(differentCategoriesExceptSelected.length)
      ]._id
    )
      .populate({ path: "course", match: { status: "Published" } })
      .exec();

    // get top selling courses
    // Step 1: get all the categories
    const allCategories = await Category.find()
      .populate({
        path: "course",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();

    // Step 2: get all the courses from all the categories in a single array
    const allCourses = allCategories.flatMap((category) => category.course);

    // Step 3: find the top selling courses
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);

    // return
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error occured while fetching category page detaills",
      error: error.message,
    });
  }
};
