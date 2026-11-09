const express = require("express");

const router = express.Router();

const maintenanceController = require("../controllers/maintenanceController");
const verifyToken = require("../middleware/authMiddleware");

console.log("Maintenance Routes Loaded");

// ==========================================
// TEST ROUTE
// ==========================================
router.get("/test", (req, res) => {
    res.json({
        message: "Maintenance Route Working"
    });
});

// ==========================================
// ADD MAINTENANCE
// ==========================================
router.post(
    "/add",
    verifyToken,
    maintenanceController.addMaintenance
);

// ==========================================
// VIEW MAINTENANCE
// ==========================================
router.get(
    "/",
    verifyToken,
    maintenanceController.getMaintenance
);

// ==========================================
// UPDATE MAINTENANCE
// ==========================================
router.put(
    "/:id",
    verifyToken,
    maintenanceController.updateMaintenance
);

// ==========================================
// DELETE MAINTENANCE
// ==========================================
router.delete(
    "/:id",
    verifyToken,
    maintenanceController.deleteMaintenance
);

module.exports = router;