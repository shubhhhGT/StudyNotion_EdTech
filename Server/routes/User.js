const express = require("express");
const router = express.Router();
const {
  sendOTP,
  signUp,
  login,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
  getUserFromToken,
  passUpdateEmail,
} = require("../controllers/ResetPassword");
const { auth } = require("../middlewares/auth");

// Routes for login, signup and authentication
// Route for login
router.post("/login", login);

// Route for signup
router.post("/signup", signUp);

// Router for sending otp to user's email
router.post("/sendotp", sendOTP);

// Router for changing password
router.put("/changepassword", auth, changePassword);

// Routes for resetting password
// route for generating reset password token
router.post("/reset-password-token", resetPasswordToken);

// route for resetting user's password after verfication
router.post("/reset-password", resetPassword);

// route for getting a user from token
router.get("/get-user-from-token/:resetPasswordToken", getUserFromToken);

// route for sending password update email
router.post("/send-confirmation-email", passUpdateEmail);

module.exports = router;
