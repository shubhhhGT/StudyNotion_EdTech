const express = require("express");
const router = express.Router();

// Importing course controllers
const {
  createCourse,
  editCourse,
  showAllCourses,
  getCourseDetails,
  getFUllCourseDetails,
  getInstructorCourses,
  deleteCourse,
} = require("../controllers/Course");

// Importimg categories controller
const {
  createCategory,
  showAllCategories,
  categoryPageDetails,
} = require("../controllers/Categories");

// Importimg Section controllers
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// Importimg Sub-Section controllers
const {
  createSubsection,
  updateSubSection,
  deleteSubsection,
} = require("../controllers/SubSection");

// Importing rating controllers
const {
  createRating,
  getAverageRating,
  getAllRating,
} = require("../controllers/RatingAndReviews");

const { updateCourseProgress } = require("../controllers/courseProgress");
// Middlewares
const {
  auth,
  isInstructor,
  isStudent,
  isAdmin,
} = require("../middlewares/auth");

// ******************************* Course routes  *******************************
// Course can be created only by instructor
router.post("/createCourse", auth, isInstructor, createCourse);
// Add a section to the course
router.post("/addSection", auth, isInstructor, createSection);
// update section
router.post("/updateSection", auth, isInstructor, updateSection);
// delete section
router.post("/deleteSection", auth, isInstructor, deleteSection);
// Add a subsection to the course
router.post("/addSubSection", auth, isInstructor, createSubsection);
// update subsection
router.post("/updateSubSection", auth, isInstructor, updateSubSection);
// delete subsection
router.post("/deleteSubSection", auth, isInstructor, deleteSubsection);
// get all courses
router.get("/showAllCourses", showAllCourses);
// Get details for a specific course
router.post("/getCourseDetails", getCourseDetails);
// Get all course details
router.post("/getFullCourseDetails", auth, getFUllCourseDetails);
// edit course
router.post("/editCourse", auth, isInstructor, editCourse);
// Get all courses for a soecific instuctor
router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses);
// delete course
router.delete("/deleteCourse", deleteCourse);

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);

// ******************************* Category routes (Only by Admin) *******************************
router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllCategories", showAllCategories);
router.post("/getCategoryPageDetails", categoryPageDetails);

// ******************************* Rating and Review *******************************
router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);

module.exports = router;
