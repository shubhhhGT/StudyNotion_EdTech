const express = require("express");
const router = express.Router();
const { auth, isInstructor } = require("../middlewares/auth");
const {
  updateProfile,
  deleteAccount,
  getAllUsers,
  updateProfilePicture,
  getEnrolledCourses,
  instructorDashboard,
} = require("../controllers/Profile");

router.delete("/deleteProfile", auth, deleteAccount);
router.get("/getUserDetails", auth, getAllUsers);
router.get("/getEnrolledCourses", auth, getEnrolledCourses);
router.put("/updateProfile", auth, updateProfile);
router.put("/updateProfiepicture", auth, updateProfilePicture);
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard);

module.exports = router;
