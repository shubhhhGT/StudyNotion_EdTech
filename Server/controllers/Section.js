const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

exports.createSection = async (req, res) => {
  try {
    // Fetch data from req body
    const { sectionName, courseId } = req.body;

    // Data validation
    if (!sectionName || !courseId) {
      return res.status(404).json({
        success: false,
        message: "Please enter all deatails before proceeding",
      });
    }

    // Create Section
    const sectionData = await Section.create({ sectionName });
    console.log(sectionData);

    // Update section in course schema
    const updatedCourse = await Course.findByIdAndUpdate(
      courseId,
      {
        $push: {
          courseContent: sectionData._id,
        },
      },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return response
    return res.status(200).json({
      success: true,
      message: "Section created successfully",
      updatedCourse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while creating section, please try again",
      error: error.message,
    });
  }
};

exports.updateSection = async (req, res) => {
  try {
    // Fetch data
    const { sectionName, sectionId, courseId } = req.body;

    // update data
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // return response
    return res.status(200).json({
      success: true,
      message: "Section updated successfully",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while updating section, please try again",
    });
  }
};

exports.deleteSection = async (req, res) => {
  try {
    //  Fetch ID fo the section to delete
    const { sectionId, courseId } = req.body;

    // Validtion
    if (!sectionId) {
      return res.status(404).json({
        success: false,
        message: "Section not found for deleting section",
      });
    }
    if (!courseId) {
      return res.status(404).json({
        success: false,
        message: "Course Id not found for deleting section",
      });
    }

    // await Course.findByIdAndUpdate(courseId, {
    //     $pull: {
    //         courseContent: sectionId,
    //     }
    // })

    const section = await Section.findById(sectionId);
    if (!section) {
      return res.status(404).json({
        success: false,
        message: "Section not found",
      });
    }

    // Update the course by removing section
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // Delete subsection(s)
    await SubSection.deleteMany({ _id: { $in: section.subSection } });

    // Delete
    await Section.findByIdAndDelete(sectionId);

    // Finf the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    // Return response
    return res.status(200).json({
      success: true,
      message: "Section deleted successfully",
      data: course,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting section, please try again",
      error: error.message,
    });
  }
};
