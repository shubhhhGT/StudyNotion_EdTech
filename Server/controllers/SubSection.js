const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
require("dotenv").config();

// Create subsection
exports.createSubsection = async (req, res) => {
  try {
    // Fetch data from req body
    const { sectionId, title, description } = req.body;

    // Extract video
    const video = req.files.video;

    // validation
    if (!sectionId || !title || !description || !video) {
      return res.status(400).json({
        success: false,
        message: "please enter all deatils before proceeding",
      });
    }

    // Upload to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );

    // create subsection
    const subSectionDeails = await SubSection.create({
      title: title,
      timeDuration: `${uploadDetails.duration}`,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });

    // update section with sub section data
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $push: {
          subSection: subSectionDeails._id,
        },
      },
      { new: true }
    ).populate("subSection");
    console.log(updatedSection);

    // Retun response
    return res.status(200).json({
      success: true,
      message: "Subsection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while creating subsection, please try again",
    });
  }
};

exports.updateSubSection = async (req, res) => {
  try {
    // Fetch data to be updated
    const { subSectionId, title, description, sectionId } = req.body;

    // validation
    // if (!subSectionId || !title || !description || !sectionId) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "please enter all deatils before proceeding",
    //   });
    // }

    const subSection = await SubSection.findById(subSectionId);
    if (!subSection) {
      return res.status(404).json({
        success: false,
        message: "sub section not found",
      });
    }

    if (title !== undefined) {
      subSection.title = title;
    }

    if (description !== undefined) {
      subSection.description = description;
    }

    if (req.files && req.files.video !== undefined) {
      const video = req.files.video;
      const uploadDetails = await uploadImageToCloudinary(
        video,
        process.env.FOLDER_NAME
      );

      subSection.videoUrl = uploadDetails.secure_url;
      subSection.timeDuration = `${uploadDetails.duration}`;
    }

    await subSection.save();

    // update Data
    const updatedSubsection = await Section.findById(sectionId).populate(
      "subSection"
    );
    console.log("updated Subsection Details", updatedSubsection);

    // Return response
    return res.status(200).json({
      success: true,
      message: "Subsection updated successfully",
      data: updatedSubsection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while updating subsection",
    });
  }
};

exports.deleteSubsection = async (req, res) => {
  try {
    // Get subsection Id to be deleted
    const { subSectionId, sectionId } = req.body;

    // delete subsection from section
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: { subSection: subSectionId },
      }
    );

    // delete the subsection
    await SubSection.findByIdAndDelete(subSectionId);

    // return updated section
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Subsection deleted successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting subsection",
    });
  }
};
