const express = require("express");
const router = express.Router();

console.log("Vehicle Routes Loaded");

const vehicleController = require("../controllers/vehicleController");
const verifyToken = require("../middleware/authMiddleware");

// Test Route
router.get("/test", (req, res) => {
    res.json({
        message: "Vehicle Route Working"
    });
});

// Add Vehicle
router.post("/add", verifyToken, vehicleController.addVehicle);

// View All Vehicles
router.get("/", verifyToken, vehicleController.getVehicles);

// Update Vehicle
router.put("/:id", verifyToken, vehicleController.updateVehicle);

// Delete Vehicle
router.delete("/:id", verifyToken, vehicleController.deleteVehicle);


module.exports = router;