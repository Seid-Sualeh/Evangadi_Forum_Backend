const express = require("express");
const router = express.Router();
const {
  register,
  login,
  check,
  forgotPassword,
  googleLogin,
  resetPassword,
} = require("../controller/usercontroller.js");
const authMiddleware = require("../middleware/authMiddleware.js");

// Register new user
router.post("/register", register);

// Login user
router.post("/login", login);

// Check authentication
router.get("/check",  check);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:token", resetPassword);

// router.post("/google", googleLogin);
router.post("/google-login", googleLogin);

module.exports = router;
