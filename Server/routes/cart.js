const express = require("express");
const {
  addToCart,
  removeFromCart,
  getEntireCart,
  resetCart,
} = require("../controllers/Cart");
const router = express.Router();

// Middlewares
const { auth, isStudent } = require("../middlewares/auth");

router.post("/addToCart", auth, isStudent, addToCart);
router.post("/removefromCart", auth, isStudent, removeFromCart);
router.get("/getEntireCart", auth, isStudent, getEntireCart);
router.post("/resetCart", auth, isStudent, resetCart);

module.exports = router;
