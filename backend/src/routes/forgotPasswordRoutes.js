const express = require("express");
const router = express.Router();

const forgotPasswordController = require("../controllers/forgotPasswordController");

// Verify Email
router.post("/", forgotPasswordController.forgotPassword);

// Reset Password
router.post("/reset", forgotPasswordController.resetPassword);

module.exports = router;