const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");

router.post("/register", authController.register);

router.post("/login", authController.login);

// Forgot Password
router.post(
    "/forgot-password",
    authController.forgotPassword
);

// Reset Password
router.post(
    "/forgot-password/reset",
    authController.resetPassword
);

module.exports = router;