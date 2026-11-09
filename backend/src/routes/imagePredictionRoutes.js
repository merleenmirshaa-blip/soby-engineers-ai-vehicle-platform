const express = require("express");

const router = express.Router();

const imagePredictionController = require("../controllers/imagePredictionController");

const verifyToken = require("../middleware/authMiddleware");

// ==========================================
// SAVE IMAGE AI PREDICTION
// ==========================================
router.post(
    "/",
    verifyToken,
    imagePredictionController.saveImagePrediction
);

// ==========================================
// GET IMAGE AI PREDICTION HISTORY
// ==========================================
router.get(
    "/",
    verifyToken,
    imagePredictionController.getImagePredictions
);

module.exports = router;