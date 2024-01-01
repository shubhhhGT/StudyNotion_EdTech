const express = require("express");
const app = express();

const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const { dbConnect } = require("./config/database");
const { cloudinaryConnect } = require("./config/cloudinary");
require("dotenv").config();
const userRoutes = require("./routes/User");
const profileRoutes = require("./routes/Profile");
const paymentRoutes = require("./routes/Payments");
const courseroutes = require("./routes/Course");
const contactUsRoute = require("./routes/Contact");
const cors = require("cors");
const passport = require("passport");
const { loginWithGoogle } = require("./controllers/Auth");

const GoogleStrategy = require("passport-google-oauth20").Strategy;
const jwt = require("jsonwebtoken");
const session = require("express-session");

const cartRoutes = require("./routes/cart");

const PORT = process.env.PORT || 4000;

// Use express-session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Add a secret for session security
    resave: false,
    saveUninitialized: true,
  })
);

// middlewares
app.use(cookieParser());
app.use(express.json());
// app.use(cors(corsOptions));
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

// Passport starts here
app.use(passport.initialize());
app.use(passport.session());

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const { user, isNewUser } = await loginWithGoogle(profile);

        const payload = {
          email: user.email,
          id: user._id,
          accountType: user.accountType,
        };

        const token = jwt.sign(payload, process.env.JWT_SECRET, {
          expiresIn: "2h",
        });

        // Create cookie
        const cookieOptions = {
          expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          httpOnly: true,
        };

        done(null, { token, user, isNewUser, cookieOptions });
      } catch (error) {
        console.log(error);
        done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  // Serialize user data and store it in the session (or JWT payload)
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // Deserialize user data from the session (or JWT payload)
  done(null, user);
});

// Route for initiating Google OAuth login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
app.get(
  "/api/v1/auth/login/google",
  passport.authenticate("google", {
    failureRedirect: "https://study-notion-ed-tech-five.vercel.app/login",
  }),
  (req, res) => {
    // In this callback, you can manually append the token and user parameters
    const token = req.user.token;
    const user = JSON.stringify(req.user.user);
    res.redirect(
      `https://study-notion-ed-tech-five.vercel.app/login?googleLogin=true&token=${token}&user=${user}`
    );
  }
);

// Passport ends here

// database connection
dbConnect();

// Cloudinary connect
cloudinaryConnect();

// Routes
app.use("/api/v1/auth", userRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/course", courseroutes);
app.use("/api/v1/reach", contactUsRoute);
app.use("/api/v1/course", cartRoutes);

// Default route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running...",
  });
});

app.listen(PORT, () => {
  console.log(`App is listening at port ${PORT}`);
});
