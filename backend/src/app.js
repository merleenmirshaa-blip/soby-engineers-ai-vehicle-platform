const express = require("express");

const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const maintenanceRoutes = require("./routes/maintenanceRoutes");
const predictionRoutes = require("./routes/predictionRoutes");
const forgotPasswordRoutes = require("./routes/forgotPasswordRoutes");
const aiRoutes = require("./routes/aiRoutes");
const imagePredictionRoutes = require("./routes/imagePredictionRoutes");
const reportRoutes = require("./routes/reportRoutes");
const app = express();

app.use(cors());

app.use(express.json());

// ==============================
// AUTH ROUTES
// ==============================
app.use("/api/auth", authRoutes);

// ==============================
// TEST ROUTES
// ==============================
app.use("/api", testRoutes);

// ==============================
// VEHICLE ROUTES
// ==============================
app.use("/api/vehicles", vehicleRoutes);

// ==============================
// MAINTENANCE ROUTES
// ==============================
app.use("/api/maintenance", maintenanceRoutes);

// ==============================
// PREDICTION ROUTES
// ==============================
app.use("/api/predictions", predictionRoutes);

// ==============================
// FORGOT PASSWORD ROUTES
// ==============================
console.log("Forgot Password Routes Loaded");

app.use("/api/forgot-password", forgotPasswordRoutes);

// ==============================
// AI ROUTES
// ==============================
app.use("/api/ai", aiRoutes);

// ==============================
// IMAGE AI PREDICTION ROUTES
// ==============================
console.log("Image Prediction Routes Loaded");
app.use("/api/reports", reportRoutes);

app.use("/api/image-predictions", imagePredictionRoutes);

module.exports = app;