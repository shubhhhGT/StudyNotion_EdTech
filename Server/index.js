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

const cartRoutes = require("./routes/cart");

const PORT = process.env.PORT || 4000;
// Allow requests from the specified Vercel domains
const allowedOrigins = [
  "https://study-notion-ed-tech-five.vercel.app",
  "https://study-notion-ed-tech-git-main-shubhhhgts-projects.vercel.app",
  "https://study-notion-ed-tech-1usgd05w5-shubhhhgts-projects.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true, // Enable credentials in CORS
};

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(cors(corsOptions));
// app.use(
//   cors({
//     origin: "https://study-notion-ed-tech-five.vercel.app",
//     credentials: true,
//   })
// );
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp",
  })
);

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
