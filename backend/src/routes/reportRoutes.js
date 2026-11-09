const express = require("express");

const router = express.Router();

const reportController = require("../controllers/reportController");

const verifyToken = require("../middleware/authMiddleware");


// Maintenance Requirement Report
router.get(
    "/maintenance-requirement",
    verifyToken,
    reportController.getMaintenanceRequirementReport
);


module.exports = router;