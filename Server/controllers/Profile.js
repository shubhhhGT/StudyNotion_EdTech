// Since we have already created a fake profile during signup we just need tpo update it now
const Profile = require("../models/Profile");
const User = require("../models/User");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const convertSecondsToDuration = require("../utils/secToDuration");
const CourseProgress = require("../models/CourseProgress");

exports.updateProfile = async (req, res) => {
  try {
    // Get data
    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;

    // get user ID
    const id = req.user.id;

    // validation
    // if (!contactNumber || !gender || !id){
    //     return res.status(400).json(
    //         {
    //             success: false,
    //             message: "Please enter all details",
    //         }
    //     )
    // }

    // FInd profile
    const userDetails = await User.findById(id);
    const userProfile = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(userProfile);

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
    });
    await user.save();

    // Update Profile
    // const updatedProfile = await Profile.findByIdAndUpdate(
    //     profileDetails,
    //     {gender: gender,
    //     dateOfBirth: dateOfBirth,
    //     about: about,
    //     contactNumber: contactNumber},
    //     {new: true}
    // )
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.gender = gender;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    await profileDetails.save();

    // FInd the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    // Send response
    return res.status(200).json({
      success: true,
      message: "user profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// Delete account
exports.deleteAccount = async (req, res) => {
  try {
    // Get ID
    const id = req.user.id;

    // Validate ID
    const userDetails = await User.findById(id);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "user not found",
      });
    }

    // delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });

    // TODO: Unenroll user from all enrolled courses
    // get courses enrolled by user
    for (const courseId of userDetails.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEntrolled: id } },
        { new: true }
      );
    }

    // delete user
    await User.findByIdAndDelete(id);

    // return response
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while deleting profile, please try again",
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    // Get ID
    const id = req.user.id;
    // validation and user details
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    // return  res
    return res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while getting profile details, please try again",
    });
  }
};

exports.updateProfilePicture = async (req, res) => {
  try {
    // get userID
    const userId = req.user.id;
    const profilePicture = req.files.profilePicture;
    const image = await uploadImageToCloudinary(
      profilePicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );

    // Update prfile pic of user
    const updatedPicture = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );

    // Return response
    return res.status(200).json({
      success: true,
      message: "Profile pic updated successfully",
      data: updatedPicture,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "cannot update profile pic, please try again",
      error: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;

    let userDetails = await User.findOne({
      _id: userId,
    })
      .populate({
        path: "courses",
        populate: { path: "courseContent", populate: { path: "subSection" } },
      })
      .exec();

    userDetails = userDetails.toObject();

    var subSecLength = 0;
    for (var i = 0; i < userDetails.courses.length; i++) {
      subSecLength = 0;
      let totalDurationinSeconds = 0;
      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationinSeconds += userDetails.courses[i].courseContent[
          j
        ].subSection.reduce(
          (acc, curr) => acc + parseInt(curr.timeDuration),
          0
        );
        // Calculate total duration for each course
        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationinSeconds
        );
        // calculate sub section length
        subSecLength +=
          userDetails.courses[i].courseContent[j].subSection.length;
      }

      // calculate progress for each course
      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i],
        userId: userId,
      });

      courseProgressCount = courseProgressCount?.completedVideos.length;

      if (subSecLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const mul = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round((courseProgressCount / subSecLength) * 100 * mul) / mul;
      }
    }

    // const allCourses = userDetails.courses;

    // const coursesWithTotalDuration = allCourses.map((course) => {
    //   let totalDurationinSeconds = 0;
    //   course.courseContent.forEach((content) => {
    //     content.subSection.forEach((subSection) => {
    //       const timeDurationinSeconds = parseInt(subSection.timeDuration);
    //       totalDurationinSeconds += timeDurationinSeconds;
    //     });
    //   });

    //   const totalDuration = convertSecondsToDuration(totalDurationinSeconds);

    //   return {
    //     ...course.toObject(),
    //     totalDuration,
    //   };
    // });

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
      // data: coursesWithTotalDuration,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async (req, res) => {
  try {
    const user = req.user.id;
    const courseDetails = await Course.find({ instructor: user });

    const courseData = courseDetails.map((course) => {
      const totalStudentsEnrolled = course.studentsEntrolled.length;
      const totalAmountGenerated = course.price * totalStudentsEnrolled;

      // create a new object with the required data
      const courseDataWithStats = {
        _id: course._id,
        courseName: course.courseName,
        courseDesc: course.courseDescription,
        totalStudents: totalStudentsEnrolled,
        totalAmount: totalAmountGenerated,
      };
      return courseDataWithStats;
    });

    return res.status(200).json({
      success: true,
      courses: courseData,
      message: "Instructor details fetched successfully",
    });
  } catch (error) {
    console.log("Error occured while getting instructor info", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
