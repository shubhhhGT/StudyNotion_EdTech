const User = require("../models/User");
const OTP = require("../models/OTP");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const Profile = require("../models/Profile");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");

// Otp Send
exports.sendOTP = async (req, res) => {
  try {
    // Fetch email from req body
    const { email } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });

    // If existing user
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // If not existing user, generate OTP
    var otp = otpGenerator.generate(6, {
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    // Check unique otp or not
    let result = await OTP.findOne({ otp: otp });

    // Generate otp till I do not get a unique otp
    while (result) {
      otp = otpGenerator.generate(6, {
        lowerCaseAlphabets: false,
        upperCaseAlphabets: false,
        specialChars: false,
      });
    }

    // save otp in database
    const otpBody = await OTP.create({ email, otp });
    console.log(otpBody);

    // Send successfull response
    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in sending OTP",
    });
  }
};

// Signup
exports.signUp = async (req, res) => {
  try {
    // Get data for signup from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      otp,
    } = req.body;

    // Validate the data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "Please enter all details!",
      });
    }

    // Match password and confirm password
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and confirmPassword value does not match, please try again",
      });
    }

    // Check if the user is an existing user
    const existingUser = await User.findOne({ email });

    // If existing user then send response
    if (existingUser) {
      return res.status(401).json({
        success: false,
        message: "User already exists",
      });
    }

    // Find most recent otp stored for the user
    const recentOTP = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("recentOTP", recentOTP);

    // validate otp
    // if (recentOTP.length === 0) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "OTP not found",
    //   });
    // }
    if (recentOTP[0].otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Please enter the correct OTP",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const profileDetails = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: null,
    });

    // Create entry in DB
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      accountType,
      additionalDetails: profileDetails._id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
    });

    // REturn response
    return res.status(200).json({
      success: true,
      message: "Signed Up successfully",
      user,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while signing up!",
    });
  }
};

// Login
exports.login = async (req, res) => {
  try {
    // Get data from req body
    const { email, password } = req.body;

    // Check if both email and password are entered
    if (!email || !password) {
      return res.status(403).json({
        success: false,
        message: "Please enter all details before proceeding",
      });
    }

    // Check if user is registerd or not
    const existingUser = await User.findOne({ email }).populate(
      "additionalDetails"
    );

    // If not existing user, then ask to sign up
    if (!existingUser) {
      return res.status(401).json({
        success: false,
        message: "Please Sign up first",
      });
    }

    // Match Password
    if (await bcrypt.compare(password, existingUser.password)) {
      const payload = {
        email: existingUser.email,
        id: existingUser._id,
        accountType: existingUser.accountType,
      };
      // Give token
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: "2h",
      });

      existingUser.token = token;
      existingUser.password = undefined;

      // Create cookie
      res
        .cookie("token", token, {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        })
        .json({
          success: true,
          token,
          existingUser,
          message: "Logged in successfully",
        });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while logging in!",
    });
  }
};

// Google login
exports.loginWithGoogle = async (profile) => {
  try {
    // Check if it is a Google login
    if (profile) {
      // If the user object exists in the profile, it means it's a Google login

      // Check if the user is already in DB
      const existingUser = await User.findOne({ googleId: profile.id });
      if (existingUser) {
        // populate additional details
        await existingUser.populate("additionalDetails");
        // User is already in Db, So just log in
        return {
          user: existingUser,
          isNewUser: false,
        };
      } else {
        // If user is not in DB, create the user
        const profileDetails = await Profile.create({
          gender: null,
          dateOfBirth: null,
          about: null,
          contactNumber: null,
        });

        const newUser = new User({
          googleId: profile.id,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          email: profile.emails[0].value,
          password: undefined,
          accountType: "Student",
          additionalDetails: profileDetails._id,
          image: profile.photos[0].value,
        });

        await newUser.save();

        return {
          user: newUser,
          isNewUser: true,
        };
      }
    }
  } catch (error) {
    console.log(error);
    throw new Error("Error occurred while logging in!");
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    // Get user data
    const userDetails = await User.findById(req.user.id);

    // Get data from req body
    const { oldPassword, newPassword } = req.body;

    // get old password, new password and confirm new pass
    // Validation
    if (!oldPassword || !newPassword) {
      return res.status(401).json({
        success: false,
        message: "Please enter all details before proceeding",
      });
    }

    const isPasswordMatch = await bcrypt.compare(
      oldPassword,
      userDetails.password
    );
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "The password is incorrect",
      });
    }

    // update pwd
    const encryptedPwd = await bcrypt.hash(newPassword, 10);
    const updatedUserDetails = await User.findByIdAndUpdate(
      { _id: req.user.id },
      { password: encryptedPwd },
      { new: true }
    );
    console.log("updatedUserDetails", updatedUserDetails);

    // Send email
    try {
      const emailResponse = await mailSender(
        updatedUserDetails.email,
        "Password for your account has been updated",
        passwordUpdated(
          updatedUserDetails.email,
          `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        )
      );
      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      console.error("Error occured while sending email", error);
      return res.status(500).json({
        success: false,
        message: "Error occured while sending email",
        error: error.message,
      });
    }

    // Return response
    return res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error occured while changing password",
    });
  }
};
