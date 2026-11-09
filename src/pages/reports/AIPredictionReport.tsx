import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowBack,
    DirectionsCar,
    Psychology,
    Build,
    Favorite,
    Speed,
    CalendarMonth,
    CheckCircle,
    WarningAmber,
    ErrorOutlined,
    TrendingUp,
    AutoAwesome,
    Assessment,
} from "@mui/icons-material";

import "./AIPredictionReport.css";

interface Vehicle {
    id: number;
    vehicle_name?: string;
    model?: string;
    registration_number?: string;
    manufacturer?: string;
    fuel_type?: string;
    mileage?: number;
    purchase_date?: string;
}

interface Prediction {
    id: number;
    vehicle_id: number;
    health_score?: number | string;
    predicted_issue?: string;
    confidence?: number | string;
    prediction?: string;
    maintenance_required?: string;
    created_at?: string;
    prediction_date?: string;
    createdAt?: string;

    vehicle_name?: string;
    model?: string;
    registration_number?: string;
    manufacturer?: string;
}

const AIPredictionReport: React.FC = () => {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState<number | "">("");

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [error, setError] = useState("");

    // =========================================================
    // FETCH DATA
    // =========================================================

    useEffect(() => {
        fetchReportData();
    }, []);

    const fetchReportData = async () => {

        try {

            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };

            const [vehicleResponse, predictionResponse] =
                await Promise.all([
                    fetch("http://localhost:5000/api/vehicles", {
                        headers,
                    }),

                    fetch("http://localhost:5000/api/predictions", {
                        headers,
                    }),
                ]);

            const vehicleData = await vehicleResponse.json();
            const predictionData = await predictionResponse.json();

            if (!vehicleResponse.ok) {
                throw new Error(
                    vehicleData?.message ||
                    "Unable to load vehicles."
                );
            }

            if (!predictionResponse.ok) {
                throw new Error(
                    predictionData?.message ||
                    "Unable to load prediction records."
                );
            }

            const vehicleList = Array.isArray(vehicleData)
                ? vehicleData
                : vehicleData?.vehicles || [];

            const predictionList = Array.isArray(predictionData)
                ? predictionData
                : predictionData?.predictions ||
                  predictionData?.records ||
                  [];

            setVehicles(vehicleList);
            setPredictions(predictionList);

        } catch (err: any) {

            console.error(
                "AI Prediction Report Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load AI prediction report."
            );

        } finally {

            setLoading(false);

        }
    };

    // =========================================================
    // SELECT VEHICLE
    // =========================================================

    const selectedVehicle = useMemo(() => {

        if (!selectedVehicleId) {
            return null;
        }

        return vehicles.find(
            (vehicle) =>
                Number(vehicle.id) ===
                Number(selectedVehicleId)
        ) || null;

    }, [vehicles, selectedVehicleId]);

    // =========================================================
    // VEHICLE PREDICTIONS
    // =========================================================

    const vehiclePredictions = useMemo(() => {

        if (!selectedVehicleId) {
            return [];
        }

        return predictions
            .filter(
                (prediction) =>
                    Number(prediction.vehicle_id) ===
                    Number(selectedVehicleId)
            )
            .sort(
                (a, b) =>
                    Number(b.id) - Number(a.id)
            );

    }, [predictions, selectedVehicleId]);

    // =========================================================
    // LATEST PREDICTION
    // =========================================================

    const latestPrediction = useMemo(() => {

        if (vehiclePredictions.length === 0) {
            return null;
        }

        return vehiclePredictions[0];

    }, [vehiclePredictions]);

    // =========================================================
    // NORMALIZE HEALTH SCORE
    // =========================================================

    const healthScore = useMemo(() => {

        if (!latestPrediction) {
            return 0;
        }

        const value = Number(
            latestPrediction.health_score
        );

        if (Number.isNaN(value)) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(100, value)
        );

    }, [latestPrediction]);

    // =========================================================
    // HEALTH STATUS
    // =========================================================

    const healthStatus = useMemo(() => {

        if (healthScore >= 80) {
            return {
                label: "Excellent",
                className: "ai-status-excellent",
                icon: <CheckCircle />,
            };
        }

        if (healthScore >= 60) {
            return {
                label: "Good",
                className: "ai-status-good",
                icon: <CheckCircle />,
            };
        }

        if (healthScore >= 40) {
            return {
                label: "Needs Attention",
                className: "ai-status-warning",
                icon: <WarningAmber />,
            };
        }

        return {
            label: "Critical",
            className: "ai-status-critical",
            icon: <ErrorOutlined />,
        };

    }, [healthScore]);

    // =========================================================
    // MAINTENANCE STATUS
    // =========================================================

    const maintenanceStatus = useMemo(() => {

        if (!latestPrediction) {
            return "Not Available";
        }

        const issue =
            latestPrediction.predicted_issue ||
            latestPrediction.prediction ||
            latestPrediction.maintenance_required ||
            "";

        const normalized =
            String(issue).toLowerCase();

        if (
            normalized.includes("yes") ||
            normalized.includes("required") ||
            normalized.includes("maintenance")
        ) {
            return "Maintenance Required";
        }

        return "No Immediate Maintenance";

    }, [latestPrediction]);

    // =========================================================
    // CONFIDENCE
    // =========================================================

    const confidence = useMemo(() => {

        if (!latestPrediction) {
            return 0;
        }

        let value =
            Number(latestPrediction.confidence);

        if (Number.isNaN(value)) {
            return 0;
        }

        // Handles values such as 0.82
        if (value > 0 && value <= 1) {
            value = value * 100;
        }

        return Math.max(
            0,
            Math.min(100, value)
        );

    }, [latestPrediction]);

    // =========================================================
    // PREDICTION DATE
    // =========================================================

    const predictionDate = useMemo(() => {

        if (!latestPrediction) {
            return "Not Available";
        }

        const dateValue =
            latestPrediction.created_at ||
            latestPrediction.prediction_date ||
            latestPrediction.createdAt;

        if (!dateValue) {
            return "Recent Analysis";
        }

        const date = new Date(dateValue);

        if (Number.isNaN(date.getTime())) {
            return String(dateValue);
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    }, [latestPrediction]);

    // =========================================================
    // AI INSIGHT
    // =========================================================

    const aiInsight = useMemo(() => {

        if (!latestPrediction) {
            return "Select a vehicle to view its AI-generated prediction.";
        }

        if (healthScore >= 80) {
            return "The vehicle is currently in good condition based on the available historical and operational vehicle data. Continue regular maintenance and monitoring.";
        }

        if (healthScore >= 60) {
            return "The vehicle is operating in a generally healthy condition. Continue scheduled maintenance and monitor upcoming service requirements.";
        }

        if (healthScore >= 40) {
            return "The AI analysis indicates that the vehicle needs attention. Review maintenance history and consider scheduling the required service.";
        }

        return "The AI analysis indicates a critical vehicle condition. Immediate maintenance inspection is recommended.";

    }, [latestPrediction, healthScore]);

    // =========================================================
    // GENERATE REPORT
    // =========================================================

    const handleGenerateReport = () => {

        if (!selectedVehicleId) {
            return;
        }

        setGenerating(true);

        setTimeout(() => {
            setGenerating(false);

            window.scrollTo({
                top: 500,
                behavior: "smooth",
            });
        }, 500);
    };

    // =========================================================
    // EMPTY STATE
    // =========================================================

    if (loading) {

        return (
            <div className="ai-report-page">

                <div className="ai-report-loading">

                    <div className="ai-loading-spinner"></div>

                    <h2>
                        Loading AI Prediction Report
                    </h2>

                    <p>
                        Fetching vehicle and prediction data...
                    </p>

                </div>

            </div>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (

        <div className="ai-report-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="ai-report-hero">

                <div className="ai-report-hero-left">

                    <button
                        className="ai-back-button"
                        onClick={() =>
                            navigate("/reports")
                        }
                    >
                        <ArrowBack />
                        Back to Reports
                    </button>

                    <div className="ai-report-tag">
                        AI INTELLIGENCE REPORT
                    </div>

                    <h1>
                        AI Prediction
                        <span> Report</span>
                    </h1>

                    <p>
                        AI-powered analysis of vehicle condition,
                        maintenance requirements and predicted
                        vehicle health.
                    </p>

                </div>

                <div className="ai-hero-icon">

                    <Psychology />

                </div>

            </section>


            {/* =================================================
                MAIN
            ================================================= */}

            <main className="ai-report-content">

                {/* =================================================
                    VEHICLE SELECTOR
                ================================================= */}

                <section className="ai-selector-card">

                    <div className="ai-selector-heading">

                        <div className="ai-selector-icon">
                            <DirectionsCar />
                        </div>

                        <div>
                            <span>
                                REPORT GENERATOR
                            </span>

                            <h2>
                                Select Vehicle
                            </h2>
                        </div>

                    </div>

                    <div className="ai-selector-controls">

                        <select
                            value={selectedVehicleId}
                            onChange={(event) =>
                                setSelectedVehicleId(
                                    event.target.value
                                        ? Number(event.target.value)
                                        : ""
                                )
                            }
                        >

                            <option value="">
                                Select a vehicle
                            </option>

                            {vehicles.map((vehicle) => (

                                <option
                                    key={vehicle.id}
                                    value={vehicle.id}
                                >
                                    {vehicle.vehicle_name ||
                                        "Vehicle"}{" "}
                                    {vehicle.registration_number
                                        ? `— ${vehicle.registration_number}`
                                        : ""}
                                </option>

                            ))}

                        </select>

                        <button
                            className="ai-generate-button"
                            onClick={handleGenerateReport}
                            disabled={
                                !selectedVehicleId ||
                                generating
                            }
                        >
                            <Assessment />

                            {generating
                                ? "Generating..."
                                : "Generate Report"}
                        </button>

                    </div>

                </section>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div className="ai-error-box">
                        {error}
                    </div>

                )}


                {/* =================================================
                    EMPTY STATE
                ================================================= */}

                {!selectedVehicle && (

                    <section className="ai-empty-state">

                        <div className="ai-empty-icon">
                            <Psychology />
                        </div>

                        <h2>
                            Generate an AI Prediction Report
                        </h2>

                        <p>
                            Select a vehicle above to view its
                            latest AI-generated health prediction,
                            maintenance status and analysis.
                        </p>

                    </section>

                )}


                {/* =================================================
                    REPORT
                ================================================= */}

                {selectedVehicle && (

                    <div className="ai-report-document">

                        {/* REPORT HEADER */}

                        <div className="ai-document-header">

                            <div className="ai-document-brand">

                                <div className="ai-brand-icon">
                                    <DirectionsCar />
                                </div>

                                <div>
                                    <h2>
                                        SOBY ENGINEERS
                                    </h2>

                                    <span>
                                        SMART VEHICLE INTELLIGENCE
                                    </span>
                                </div>

                            </div>

                            <div className="ai-document-title">

                                <span>
                                    GENERATED REPORT
                                </span>

                                <strong>
                                    AI PREDICTION
                                </strong>

                            </div>

                        </div>


                        {/* VEHICLE INFORMATION */}

                        <section className="ai-vehicle-summary">

                            <div className="ai-vehicle-main">

                                <div className="ai-car-icon">
                                    <DirectionsCar />
                                </div>

                                <div>

                                    <span>
                                        VEHICLE ANALYSIS
                                    </span>

                                    <h2>
                                        {selectedVehicle.vehicle_name ||
                                            "Vehicle"}
                                    </h2>

                                    <p>
                                        {selectedVehicle.manufacturer ||
                                            "Manufacturer"}{" "}
                                        {selectedVehicle.model || ""}
                                    </p>

                                </div>

                            </div>


                            <div className="ai-vehicle-meta">

                                <div>
                                    <span>
                                        REGISTRATION
                                    </span>

                                    <strong>
                                        {selectedVehicle.registration_number ||
                                            "Not Available"}
                                    </strong>
                                </div>

                                <div>
                                    <span>
                                        PREDICTION DATE
                                    </span>

                                    <strong>
                                        {predictionDate}
                                    </strong>
                                </div>

                            </div>

                        </section>


                        {/* NO PREDICTION */}

                        {!latestPrediction && (

                            <div className="ai-no-prediction">

                                <Psychology />

                                <h3>
                                    No AI Prediction Available
                                </h3>

                                <p>
                                    This vehicle does not have a
                                    stored AI prediction yet.
                                    Run an AI prediction from the
                                    AI Prediction module first.
                                </p>

                                <button
                                    onClick={() =>
                                        navigate(
                                            "/ai-prediction"
                                        )
                                    }
                                >
                                    Run AI Prediction
                                </button>

                            </div>

                        )}


                        {/* PREDICTION DATA */}

                        {latestPrediction && (

                            <>

                                {/* =================================================
                                    SCORE SECTION
                                ================================================= */}

                                <section className="ai-score-section">

                                    <div className="ai-score-card">

                                        <div
                                            className="ai-score-ring"
                                            style={{
                                                background:
                                                    `conic-gradient(#163a63 ${healthScore * 3.6}deg, #e8eef5 0deg)`,
                                            }}
                                        >

                                            <div className="ai-score-inner">

                                                <strong>
                                                    {healthScore.toFixed(1)}
                                                </strong>

                                                <span>
                                                    / 100
                                                </span>

                                            </div>

                                        </div>

                                        <div className="ai-score-text">

                                            <span>
                                                VEHICLE HEALTH SCORE
                                            </span>

                                            <h2>
                                                {healthStatus.label}
                                            </h2>

                                            <p>
                                                Overall health score
                                                generated from the
                                                available vehicle data.
                                            </p>

                                        </div>

                                    </div>


                                    <div className="ai-status-card">

                                        <span>
                                            HEALTH STATUS
                                        </span>

                                        <div
                                            className={`ai-status-badge ${healthStatus.className}`}
                                        >
                                            {healthStatus.icon}
                                            {healthStatus.label}
                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                                    METRICS
                                ================================================= */}

                                <section className="ai-metrics-grid">

                                    <div className="ai-metric-card">

                                        <div className="ai-metric-icon blue">
                                            <Psychology />
                                        </div>

                                        <div>

                                            <span>
                                                AI CONFIDENCE
                                            </span>

                                            <strong>
                                                {confidence.toFixed(1)}%
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="ai-metric-card">

                                        <div className="ai-metric-icon orange">
                                            <Build />
                                        </div>

                                        <div>

                                            <span>
                                                MAINTENANCE
                                            </span>

                                            <strong>
                                                {maintenanceStatus}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="ai-metric-card">

                                        <div className="ai-metric-icon green">
                                            <Speed />
                                        </div>

                                        <div>

                                            <span>
                                                CURRENT MILEAGE
                                            </span>

                                            <strong>
                                                {selectedVehicle.mileage
                                                    ? `${Number(
                                                        selectedVehicle.mileage
                                                    ).toLocaleString()} km`
                                                    : "Not Available"}
                                            </strong>

                                        </div>

                                    </div>


                                    <div className="ai-metric-card">

                                        <div className="ai-metric-icon purple">
                                            <CalendarMonth />
                                        </div>

                                        <div>

                                            <span>
                                                ANALYSIS RECORDS
                                            </span>

                                            <strong>
                                                {vehiclePredictions.length}
                                            </strong>

                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                                    PREDICTION RESULT
                                ================================================= */}

                                <section className="ai-result-section">

                                    <div className="ai-section-heading">

                                        <div className="ai-section-heading-icon">
                                            <AutoAwesome />
                                        </div>

                                        <div>
                                            <span>
                                                RANDOM FOREST ANALYSIS
                                            </span>

                                            <h2>
                                                Prediction Result
                                            </h2>
                                        </div>

                                    </div>


                                    <div className="ai-result-grid">

                                        <div className="ai-result-box">

                                            <span>
                                                PREDICTED MAINTENANCE
                                            </span>

                                            <strong>
                                                {latestPrediction.predicted_issue ||
                                                    latestPrediction.prediction ||
                                                    latestPrediction.maintenance_required ||
                                                    "Not Available"}
                                            </strong>

                                        </div>


                                        <div className="ai-result-box">

                                            <span>
                                                AI CONFIDENCE
                                            </span>

                                            <strong>
                                                {confidence.toFixed(1)}%
                                            </strong>

                                            <div className="ai-progress">
                                                <div
                                                    style={{
                                                        width: `${confidence}%`,
                                                    }}
                                                ></div>
                                            </div>

                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                                    VEHICLE DATA
                                ================================================= */}

                                <section className="ai-data-section">

                                    <div className="ai-section-heading">

                                        <div className="ai-section-heading-icon">
                                            <DirectionsCar />
                                        </div>

                                        <div>
                                            <span>
                                                VEHICLE INFORMATION
                                            </span>

                                            <h2>
                                                Analysis Data
                                            </h2>
                                        </div>

                                    </div>


                                    <div className="ai-data-grid">

                                        <div>
                                            <span>
                                                Vehicle Name
                                            </span>

                                            <strong>
                                                {selectedVehicle.vehicle_name ||
                                                    "Not Available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Manufacturer
                                            </span>

                                            <strong>
                                                {selectedVehicle.manufacturer ||
                                                    "Not Available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Model
                                            </span>

                                            <strong>
                                                {selectedVehicle.model ||
                                                    "Not Available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Registration Number
                                            </span>

                                            <strong>
                                                {selectedVehicle.registration_number ||
                                                    "Not Available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Fuel Type
                                            </span>

                                            <strong>
                                                {selectedVehicle.fuel_type ||
                                                    "Not Available"}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                Mileage
                                            </span>

                                            <strong>
                                                {selectedVehicle.mileage
                                                    ? `${Number(
                                                        selectedVehicle.mileage
                                                    ).toLocaleString()} km`
                                                    : "Not Available"}
                                            </strong>
                                        </div>

                                    </div>

                                </section>


                                {/* =================================================
                                    AI INSIGHT
                                ================================================= */}

                                <section className="ai-insight-section">

                                    <div className="ai-insight-icon">
                                        <Favorite />
                                    </div>

                                    <div>

                                        <span>
                                            AI INSIGHT
                                        </span>

                                        <h3>
                                            Vehicle Intelligence Summary
                                        </h3>

                                        <p>
                                            {aiInsight}
                                        </p>

                                    </div>

                                </section>


                                {/* =================================================
                                    PREDICTION HISTORY
                                ================================================= */}

                                {vehiclePredictions.length > 1 && (

                                    <section className="ai-history-section">

                                        <div className="ai-section-heading">

                                            <div className="ai-section-heading-icon">
                                                <TrendingUp />
                                            </div>

                                            <div>
                                                <span>
                                                    HISTORICAL ANALYSIS
                                                </span>

                                                <h2>
                                                    Previous Predictions
                                                </h2>
                                            </div>

                                        </div>


                                        <div className="ai-history-list">

                                            {vehiclePredictions
                                                .slice(0, 5)
                                                .map((prediction) => {

                                                    const score =
                                                        Number(
                                                            prediction.health_score
                                                        ) || 0;

                                                    return (

                                                        <div
                                                            className="ai-history-item"
                                                            key={prediction.id}
                                                        >

                                                            <div className="ai-history-number">
                                                                {prediction.id}
                                                            </div>

                                                            <div className="ai-history-info">

                                                                <strong>
                                                                    Health Score:{" "}
                                                                    {score.toFixed(1)}
                                                                </strong>

                                                                <span>
                                                                    {prediction.predicted_issue ||
                                                                        prediction.prediction ||
                                                                        "Prediction recorded"}
                                                                </span>

                                                            </div>

                                                            <div className="ai-history-confidence">

                                                                {Number(
                                                                    prediction.confidence
                                                                ).toFixed(1)}
                                                                %

                                                            </div>

                                                        </div>

                                                    );
                                                })}

                                        </div>

                                    </section>

                                )}

                            </>

                        )}


                        {/* FOOTER */}

                        <footer className="ai-report-footer">

                            <div>
                                Soby Engineers – AI-Driven Smart Vehicle
                                Intelligence and Predictive Maintenance Platform
                            </div>

                            <span>
                                AI Prediction Report
                            </span>

                        </footer>

                    </div>

                )}

            </main>

        </div>
    );
};

export default AIPredictionReport;