const Category = require("../models/Category");
const User = require("../models/User");
const Course = require("../models/Course");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");

// create course handler
exports.createCourse = async (req, res) => {
  try {
    // Get user id
    const userId = req.user.id;

    // Get data from req body
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag: _tag,
      instructions: _instructions,
      status,
    } = req.body;

    // Get thumbnail
    const thumbnail = req.files.thumbnailImage;

    // Convert the tag and isntructions from Stringified array to array
    const tag = JSON.parse(_tag);
    const instructions = JSON.parse(_instructions);
    console.log("tag", tag);
    console.log("instructions", instructions);

    // Validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !thumbnail ||
      !tag.length ||
      !instructions.length
    ) {
      return res.this.status(400).jon({
        success: false,
        message: "All fields are required",
      });
    }

    if (!status || status === undefined) {
      status = "Draft";
    }

    // Check for instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });
    console.log("instructor details:", instructorDetails);

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: "Instructor details not found",
      });
    }

    // check if category is valid or not
    const categoryDetails = await Category.findById(category);
    if (!categoryDetails) {
      return res.status(404).json({
        success: false,
        message: "Category details not found",
      });
    }

    // Upload image to cloudinary
    const thumbnailImage = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    // Create an entry for new course
    const newCourse = await Course.create({
      courseName,
      courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price,
      tag,
      instructions,
      status: status,
      category: categoryDetails._id,
      thumbnail: thumbnailImage.secure_url,
    });

    // Add the new course to the schema of instructor
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      {
        new: true,
      }
    );

    // Update category schema
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          course: newCourse._id,
        },
      },
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully",
      data: newCourse,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while creating course",
    });
  }
};

// Edit course details
exports.editCourse = async (req, res) => {
  try {
    // get course Id of the course that is to be edited
    const { courseId } = req.body;
    const updates = req.body;

    // Find the course
    const course = await Course.findById(courseId);

    // Validation
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found",
      });
    }

    // If thumbnail image is found then update it
    if (req.files) {
      console.log("thumbnail update");
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
    }

    // Update only the fields that are present in req body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }

    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    res.json({
      success: true,
      message: "Course updated successfully",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Error occured while updating course",
      error: error.message,
    });
  }
};

// Show all courses
exports.showAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEntrolled: true,
      }
    )
      .populate("instructor")
      .exec();

    return res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully",
      data: allCourses,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Cannot fetch all courses",
      error: error.message,
    });
  }
};

// getCourseDetails
exports.getCourseDetails = async (req, res) => {
  try {
    // Get ID from req body
    const { courseId } = req.body;

    // Find course details
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection", select: "-videoUrl" },
      })
      .exec();

    // Validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with ${courseId}`,
      });
    }

    // Find the total duration
    let totalDurationinSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationinSeconds = parseInt(subSection.timeDuration);
        totalDurationinSeconds += timeDurationinSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationinSeconds);

    // Return response
    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      data: { courseDetails, totalDuration },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      mesage: "Error occured while fetching course details",
      error: error.message,
    });
  }
};

// get full course detail
exports.getFUllCourseDetails = async (req, res) => {
  try {
    // Get ID from req body
    const { courseId } = req.body;
    const userId = req.user.id;

    // Find course details
    const courseDetails = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .populate("instructions")
      .exec();

    // Validation
    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `could not find the course with ${courseId}`,
      });
    }

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount: ", courseProgressCount);

    // Find the total duration
    let totalDurationinSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationinSeconds = parseInt(subSection.timeDuration);
        totalDurationinSeconds += timeDurationinSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationinSeconds);

    // Return response
    return res.status(200).json({
      success: true,
      message: "course details fetched successfully",
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      mesage: "Error occured while fetching full course details",
      error: error.message,
    });
  }
};

// Get a list of all courses for an instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    // get instructor ID
    const instructorId = req.user.id;

    // Find all the courses belonging to the instructor
    const instructorCourses = await Course.find({
      instructor: instructorId,
    })
      .sort({ createdAt: -1 })
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    // Calculate time duration for each course
    const coursesWithTotalDuration = instructorCourses.map((course) => {
      // Find the total duration
      let totalDurationinSeconds = 0;
      course.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
          const timeDurationinSeconds = parseInt(subSection.timeDuration);
          totalDurationinSeconds += timeDurationinSeconds;
        });
      });

      const totalDuration = convertSecondsToDuration(totalDurationinSeconds);

      // Add totalDuration to course object
      return {
        ...course.toObject(),
        totalDuration,
      };
    });

    // Return intructor courses
    res.status(200).json({
      success: true,
      data: coursesWithTotalDuration,
      // courseDuration: coursesWithTotalDuration,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "failed to retrieve instructor courses",
      error: error.message,
    });
  }
};

// Delete course
exports.deleteCourse = async (req, res) => {
  try {
    // get course id to be deleted
    const { courseId } = req.body;

    // find the course
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "course not found" });
    }

    // unenroll students from course
    const studentsEntrolled = course.studentsEntrolled;
    for (const studentId of studentsEntrolled) {
      await User.findByIdAndUpdate(studentId, {
        $pull: { courses: courseId },
      });
    }

    // Delete sections and sub sections
    const courseSections = course.courseContent;
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subsection = section.subSection;
        for (const subSectionId of subsection) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }

      // Delete section
      await Section.findByIdAndDelete(sectionId);
    }

    // Delete course
    await Course.findByIdAndDelete(courseId);

    return res.status(200).json({
      success: true,
      message: "Course deleted successfullly",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};
