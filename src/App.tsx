import React from "react";

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

// ==========================================
// AUTHENTICATION
// ==========================================

import Login from "./pages/login/login";
import Register from "./pages/register/register";
import ForgotPassword from "./pages/forgotPassword/forgotPassword";
import ResetPassword from "./pages/resetPassword/resetPassword";

// ==========================================
// DASHBOARD
// ==========================================

import Dashboard from "./pages/dashboard/Dashboard";

// ==========================================
// VEHICLES
// ==========================================

import Vehicles from "./pages/vehicles/Vehicles";
import AddVehicle from "./pages/vehicles/AddVehicle";
import EditVehicle from "./pages/vehicles/EditVehicle";

// ==========================================
// MAINTENANCE
// ==========================================

import Maintenance from "./pages/maintenance/Maintenance";
import AddMaintenance from "./pages/maintenance/AddMaintenance";
import EditMaintenance from "./pages/maintenance/EditMaintenance";

// ==========================================
// AI PREDICTION
// ==========================================

import AIPrediction from "./pages/aiPrediction/AIPrediction";
import PredictionHistory from "./pages/aiPrediction/PredictionHistory";

// ==========================================
// IMAGE AI
// ==========================================

import ImageAI from "./pages/image-ai/ImageAI";
import ImageAIHistory from "./pages/image-ai-history/ImageAIHistory";

// ==========================================
// REPORTS
// ==========================================

import Reports from "./pages/reports/Reports";
import VehicleDetailsReport from "./pages/reports/VehicleDetailsReport";
import MaintenanceHistoryReport from "./pages/reports/MaintenanceHistoryReport";
import VehicleHealthReport from "./pages/reports/VehicleHealthReport";
import AIPredictionReport from "./pages/reports/AIPredictionReport";
import MaintenanceRequirementReport from "./pages/reports/MaintenanceRequirementReport";


function App() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ==========================================
                    DEFAULT ROUTE
                =========================================== */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />


                {/* ==========================================
                    AUTHENTICATION
                =========================================== */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />


                {/* ==========================================
                    DASHBOARD
                =========================================== */}

                <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />


                {/* ==========================================
                    VEHICLES
                =========================================== */}

                <Route
                    path="/vehicles"
                    element={<Vehicles />}
                />

                <Route
                    path="/vehicles/add"
                    element={<AddVehicle />}
                />

                <Route
                    path="/vehicles/edit/:id"
                    element={<EditVehicle />}
                />


                {/* ==========================================
                    MAINTENANCE
                =========================================== */}

                <Route
                    path="/maintenance"
                    element={<Maintenance />}
                />
                <Route
    path="/maintenance/add"
    element={<AddMaintenance />}
    
/>
<Route path="/maintenance/edit" element={<EditMaintenance />} />

                {/* ==========================================
                    AI PREDICTION
                =========================================== */}

                <Route
                    path="/ai-prediction"
                    element={<AIPrediction />}
                />


                {/* ==========================================
                    PREDICTION HISTORY
                =========================================== */}

                <Route
                    path="/prediction-history"
                    element={<PredictionHistory />}
                />


                {/* ==========================================
                    IMAGE AI
                =========================================== */}

                <Route
                    path="/image-ai"
                    element={<ImageAI />}
                />

                <Route
                    path="/image-ai-history"
                    element={<ImageAIHistory />}
                />


                {/* ==========================================
                    REPORTS
                =========================================== */}

                <Route
                    path="/reports"
                    element={<Reports />}
                />

                <Route
                    path="/reports/vehicle-details"
                    element={<VehicleDetailsReport />}
                />

                <Route
                    path="/reports/maintenance-history"
                    element={<MaintenanceHistoryReport />}
                />

                <Route
                    path="/reports/vehicle-health"
                    element={<VehicleHealthReport />}
                />

                <Route
                    path="/reports/ai-prediction"
                    element={<AIPredictionReport />}
                />

                <Route
                    path="/reports/maintenance-requirement"
                    element={<MaintenanceRequirementReport />}
                />


                {/* ==========================================
                    UNKNOWN ROUTE
                =========================================== */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/dashboard"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
}

export default App;