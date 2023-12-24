const BASE_URL = process.env.REACT_APP_BASE_URL;

// Authentication endpoints
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendOtp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  GETUSER_API: BASE_URL + "/auth/get-user-from-token",
  SENDPASSRESETEMAIL_API: BASE_URL + "/auth/send-confirmation-email",
};

// Contact Endpoint
export const contactUsEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};

export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
};

// Settings Endpoints
export const settingsEndpoints = {
  UPDATE_PROFILE_PICTURE_API: BASE_URL + "/profile/updateProfiepicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
};

// Profile Endpoints
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

// Course Endpoints
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/showAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
};

// Catalog Endpoint
export const catalogEndpoint = {
  CATALOG_DATA_API: BASE_URL + "/course/getCategoryPageDetails",
};

// Student Endpoints
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

// cart endpoints
export const cartEndpoints = {
  ADD_TO_CART: BASE_URL + "/course/addToCart",
  REMOVE_FROM_CART: BASE_URL + "/course/removeFromCart",
  GET_ENTIRE_CART: BASE_URL + "/course/getEntireCart",
  RESET_CART: BASE_URL + "/course/resetCart",
};

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};
