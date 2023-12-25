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

// middlewares
app.use(cookieParser());
app.use(express.json());
app.use(
  cors({
    origin: "https://study-notion-ed-tech-five.vercel.app",
    credentials: true,
  })
);
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
