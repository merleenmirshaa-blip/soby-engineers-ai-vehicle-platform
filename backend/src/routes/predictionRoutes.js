const express = require("express");

const router = express.Router();

const predictionController =
    require("../controllers/predictionController");

const verifyToken =
    require("../middleware/authMiddleware");

console.log("Prediction Routes Loaded");

router.get(
    "/",
    verifyToken,
    predictionController.getPredictions
);

module.exports = router;