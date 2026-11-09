const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");
const verifyToken = require("../middleware/authMiddleware");

console.log("AI Routes Loaded");

router.post(
    "/predict",
    verifyToken,
    aiController.predictMaintenance
);

router.get(
    "/vehicle/:vehicleId/predict",
    verifyToken,
    aiController.predictVehicleMaintenance
);

module.exports = router;