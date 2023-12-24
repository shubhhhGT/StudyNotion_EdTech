const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const {
  passwordResetTemplate,
} = require("../mail/templates/PasswordResetEmail");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// Reset Password token
exports.resetPasswordToken = async (req, res) => {
  try {
    // Get email to change password
    const email = req.body.email;

    // check user for this email, email validation
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "The user for this email do not exist, Please register first!",
      });
    }

    // generate token using crypto
    const token = crypto.randomUUID();

    // update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        resetPasswordToken: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );
    console.log(updatedDetails);

    // create url
    const url = `http://localhost:3000/update-password/${token}`;

    // send email containing url
    await mailSender(email, "Password Reset Link", passwordResetTemplate(url));

    // return res
    res.status(200).json({
      success: true,
      message:
        "Email sent successfully, please check email and generate new passowrd",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while sending reset passowrd email",
    });
  }
};

// Reset password
exports.resetPassword = async (req, res) => {
  try {
    // Get data
    const { password, confirmPassword, resetPasswordToken } = req.body;

    // validation
    if (password !== confirmPassword) {
      return res.status(403).json({
        success: false,
        message: "The entered passwords do not match",
      });
    }

    // Get user details from token
    const user = await User.findOne({ resetPasswordToken });

    // If no entry - invalid token
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // Check for token expiry
    if (user.resetPasswordExpires < Date.now()) {
      return res.json({
        success: false,
        message:
          "The reset link has expired please generate a new link to proceed",
      });
    }

    // Hash pwd
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update Pwd
    await User.findOneAndUpdate(
      { resetPasswordToken: resetPasswordToken },
      { password: hashedPassword },
      { new: true }
    );

    // Return res
    return res.status(200).json({
      success: true,
      message: "Password Reset Successful",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while resetting the password",
    });
  }
};

exports.getUserFromToken = async (req, res) => {
  try {
    // Get token from either req.body or req.params
    const { resetPasswordToken } = req.params;
    console.log(resetPasswordToken);

    // Check if token is present
    if (!resetPasswordToken) {
      return res.status(400).json({
        success: false,
        message: "Token is missing in the request.",
      });
    }

    // Get user details from token
    const user = await User.findOne({ resetPasswordToken });

    // If no entry - invalid token
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid Token",
      });
    }

    // Check for token expiry
    if (user.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message:
          "The reset link has expired. Please generate a new link to proceed.",
      });
    }

    // Return user details
    return res.status(200).json({
      success: true,
      message: "User found successfully",
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message:
        "Something went wrong while searching for the user from the token.",
    });
  }
};

exports.passUpdateEmail = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Email missing",
      });
    }

    await mailSender(
      email,
      "Password Update Confirmation",
      passwordUpdated(email)
    );

    return res.status(200).json({
      success: true,
      message: "Password Update Confirmation email sent successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Error in sending Password Update Confirmation email",
    });
  }
};
