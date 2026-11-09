import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    ArrowBack,
    DirectionsCar,
    Build,
    Psychology,
    CheckCircle,
    WarningAmber,
    ErrorOutlined,
    AutoAwesome,
    Assessment,
    EventAvailable,
} from "@mui/icons-material";

import "./MaintenanceRequirementReport.css";


// ======================================================
// VEHICLE
// ======================================================

interface Vehicle {
    id: number;
    vehicle_name?: string;
    model?: string;
    registration_number?: string;
    manufacturer?: string;
    fuel_type?: string;
    mileage?: number;
}


// ======================================================
// PREDICTION
// Matches the project's prediction data
// ======================================================

interface Prediction {
    id: number;
    vehicle_id: number;

    maintenance_required?: string | number | boolean;

    probability?: number | string;

    health_score?: number | string;

    health_status?: string;

    recommendation?: string;

    prediction_date?: string;
}


// ======================================================
// MAINTENANCE
// ======================================================

interface Maintenance {
    id: number;
    vehicle_id: number;

    service_date?: string;

    next_service_date?: string;

    service_type?: string;

    cost?: number | string;

    service_center?: string;

    notes?: string;

    mileage_at_service?: number | string;
}


// ======================================================
// COMPONENT
// ======================================================

const MaintenanceRequirementReport: React.FC = () => {

    const navigate = useNavigate();

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [predictions, setPredictions] =
        useState<Prediction[]>([]);

    const [maintenance, setMaintenance] =
        useState<Maintenance[]>([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState<number | "">("");

    const [loading, setLoading] =
        useState<boolean>(true);

    const [generating, setGenerating] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string>("");


    // ======================================================
    // LOAD REPORT DATA
    // ======================================================

    useEffect(() => {
        loadReportData();
    }, []);


    const loadReportData = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            const headers = {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            };


            const [
                vehicleResponse,
                predictionResponse,
                maintenanceResponse,
            ] = await Promise.all([

                fetch(
                    "http://localhost:5000/api/vehicles",
                    {
                        headers,
                    }
                ),

                fetch(
                    "http://localhost:5000/api/predictions",
                    {
                        headers,
                    }
                ),

                fetch(
                    "http://localhost:5000/api/maintenance",
                    {
                        headers,
                    }
                ),

            ]);


            const vehicleData =
                await vehicleResponse.json();

            const predictionData =
                await predictionResponse.json();

            const maintenanceData =
                await maintenanceResponse.json();


            // ----------------------------------------------
            // VEHICLES ERROR
            // ----------------------------------------------

            if (!vehicleResponse.ok) {

                throw new Error(
                    vehicleData?.message ||
                    "Unable to load vehicles."
                );

            }


            // ----------------------------------------------
            // PREDICTIONS ERROR
            // ----------------------------------------------

            if (!predictionResponse.ok) {

                throw new Error(
                    predictionData?.message ||
                    "Unable to load predictions."
                );

            }


            // ----------------------------------------------
            // MAINTENANCE ERROR
            // ----------------------------------------------

            if (!maintenanceResponse.ok) {

                throw new Error(
                    maintenanceData?.message ||
                    "Unable to load maintenance records."
                );

            }


            // ----------------------------------------------
            // NORMALIZE VEHICLES
            // ----------------------------------------------

            const vehicleList: Vehicle[] =
                Array.isArray(vehicleData)
                    ? vehicleData
                    : vehicleData?.vehicles || [];


            // ----------------------------------------------
            // NORMALIZE PREDICTIONS
            // ----------------------------------------------

            const predictionList: Prediction[] =
                Array.isArray(predictionData)
                    ? predictionData
                    : predictionData?.predictions ||
                      predictionData?.records ||
                      [];


            // ----------------------------------------------
            // NORMALIZE MAINTENANCE
            // ----------------------------------------------

            const maintenanceList: Maintenance[] =
                Array.isArray(maintenanceData)
                    ? maintenanceData
                    : maintenanceData?.maintenance ||
                      maintenanceData?.records ||
                      [];


            setVehicles(vehicleList);
            setPredictions(predictionList);
            setMaintenance(maintenanceList);

        } catch (err: any) {

            console.error(
                "Maintenance Requirement Report Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load maintenance requirement report."
            );

        } finally {

            setLoading(false);

        }
    };


    // ======================================================
    // SELECTED VEHICLE
    // ======================================================

    const selectedVehicle = useMemo(() => {

        if (!selectedVehicleId) {
            return null;
        }

        return (
            vehicles.find(
                (vehicle) =>
                    Number(vehicle.id) ===
                    Number(selectedVehicleId)
            ) || null
        );

    }, [
        vehicles,
        selectedVehicleId,
    ]);


    // ======================================================
    // VEHICLE PREDICTIONS
    // ======================================================

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
                    Number(b.id) -
                    Number(a.id)
            );

    }, [
        predictions,
        selectedVehicleId,
    ]);


    const latestPrediction =
        vehiclePredictions[0];


    // ======================================================
    // VEHICLE MAINTENANCE
    // ======================================================

    const vehicleMaintenance = useMemo(() => {

        if (!selectedVehicleId) {
            return [];
        }

        return maintenance
            .filter(
                (record) =>
                    Number(record.vehicle_id) ===
                    Number(selectedVehicleId)
            )
            .sort(
                (a, b) =>
                    Number(b.id) -
                    Number(a.id)
            );

    }, [
        maintenance,
        selectedVehicleId,
    ]);


    // ======================================================
    // HEALTH SCORE
    // ======================================================

    const healthScore = useMemo(() => {

        const score =
            Number(
                latestPrediction?.health_score
            );

        if (Number.isNaN(score)) {
            return 0;
        }

        return Math.max(
            0,
            Math.min(100, score)
        );

    }, [latestPrediction]);


    // ======================================================
    // AI PROBABILITY / CONFIDENCE
    // ======================================================

    const confidence = useMemo(() => {

        let value =
            Number(
                latestPrediction?.probability
            );

        if (Number.isNaN(value)) {
            return 0;
        }

        // Handles both:
        // 0.65  -> 65%
        // 65    -> 65%

        if (
            value > 0 &&
            value <= 1
        ) {
            value *= 100;
        }

        return Math.max(
            0,
            Math.min(100, value)
        );

    }, [latestPrediction]);


    // ======================================================
    // MAINTENANCE REQUIREMENT
    // ======================================================

    const maintenanceRequired =
        useMemo(() => {

            if (!latestPrediction) {
                return false;
            }

            const value =
                String(
                    latestPrediction
                        .maintenance_required
                ).toLowerCase();


            return (
                value === "yes" ||
                value === "true" ||
                value === "1" ||
                value.includes("required")
            );

        }, [latestPrediction]);


    // ======================================================
    // REQUIREMENT STATUS
    // ======================================================

    const requirement = useMemo(() => {

        if (!latestPrediction) {

            return {
                label: "Not Available",
                className: "mr-neutral",
                icon: <Build />,
            };

        }


        if (maintenanceRequired) {

            if (healthScore < 40) {

                return {
                    label: "Immediate Maintenance",
                    className: "mr-critical",
                    icon: <ErrorOutlined />,
                };

            }

            return {
                label: "Maintenance Required",
                className: "mr-warning",
                icon: <WarningAmber />,
            };

        }


        if (healthScore < 60) {

            return {
                label: "Inspection Recommended",
                className: "mr-warning",
                icon: <WarningAmber />,
            };

        }


        return {
            label: "No Immediate Requirement",
            className: "mr-good",
            icon: <CheckCircle />,
        };

    }, [
        latestPrediction,
        maintenanceRequired,
        healthScore,
    ]);


    // ======================================================
    // LAST MAINTENANCE
    // ======================================================

    const lastMaintenance =
        vehicleMaintenance[0];


    // ======================================================
    // LAST SERVICE DATE
    // ======================================================

    const lastServiceDate = useMemo(() => {

        const value =
            lastMaintenance?.service_date;

        if (!value) {
            return "Not Available";
        }

        const date =
            new Date(value);

        if (
            Number.isNaN(
                date.getTime()
            )
        ) {
            return String(value);
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    }, [lastMaintenance]);


    // ======================================================
    // LAST SERVICE TYPE
    // ======================================================

    const maintenanceType =
        lastMaintenance?.service_type ||
        "Not Available";


    // ======================================================
    // RECOMMENDATION
    // ======================================================

    const recommendation = useMemo(() => {

        if (!latestPrediction) {

            return (
                "Run an AI vehicle prediction to " +
                "determine the current maintenance requirement."
            );

        }


        // Use recommendation generated by AI
        // when available.

        if (
            latestPrediction.recommendation &&
            latestPrediction.recommendation.trim()
        ) {

            return latestPrediction.recommendation;

        }


        // Fallback recommendation

        if (healthScore < 40) {

            return (
                "The vehicle requires immediate inspection " +
                "and maintenance. Check critical mechanical " +
                "components before continued regular usage."
            );

        }


        if (healthScore < 60) {

            return (
                "The vehicle requires attention. Review the " +
                "maintenance history and schedule the necessary " +
                "service at the earliest suitable opportunity."
            );

        }


        if (healthScore < 80) {

            return (
                "The vehicle is generally operational, but " +
                "regular preventive maintenance should be " +
                "continued to maintain its current condition."
            );

        }


        return (
            "The vehicle is currently in good condition. " +
            "Continue scheduled maintenance and periodic " +
            "AI-based health assessment."
        );

    }, [
        latestPrediction,
        healthScore,
    ]);


    // ======================================================
    // GENERATE REPORT
    // ======================================================

    const handleGenerateReport = () => {

        if (!selectedVehicleId) {
            return;
        }

        setGenerating(true);

        setTimeout(() => {

            setGenerating(false);

            window.scrollTo({
                top: 450,
                behavior: "smooth",
            });

        }, 500);
    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {

        return (

            <div className="mr-page">

                <div className="mr-loading">

                    <div className="mr-spinner"></div>

                    <h2>
                        Loading Maintenance Requirement Report
                    </h2>

                    <p>
                        Fetching vehicle, maintenance and AI data...
                    </p>

                </div>

            </div>

        );

    }


    // ======================================================
    // MAIN UI
    // ======================================================

    return (

        <div className="mr-page">


            {/* ==================================================
                HERO
            ================================================== */}

            <section className="mr-hero">

                <div className="mr-hero-content">

                    <button
                        className="mr-back"
                        onClick={() =>
                            navigate("/reports")
                        }
                    >
                        <ArrowBack />
                        Back to Reports
                    </button>


                    <div className="mr-tag">
                        MAINTENANCE INTELLIGENCE
                    </div>


                    <h1>
                        Maintenance Requirement
                        <span> Report</span>
                    </h1>


                    <p>
                        Identify current maintenance requirements
                        using AI prediction, vehicle health and
                        historical maintenance information.
                    </p>

                </div>


                <div className="mr-hero-icon">
                    <Build />
                </div>

            </section>


            <main className="mr-content">


                {/* ==================================================
                    SELECT VEHICLE
                ================================================== */}

                <section className="mr-selector">

                    <div className="mr-selector-title">

                        <div className="mr-selector-icon">
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


                    <div className="mr-controls">

                        <select
                            value={selectedVehicleId}
                            onChange={(event) =>
                                setSelectedVehicleId(
                                    event.target.value
                                        ? Number(
                                            event.target.value
                                        )
                                        : ""
                                )
                            }
                        >

                            <option value="">
                                Select a vehicle
                            </option>


                            {vehicles.map(
                                (vehicle) => (

                                    <option
                                        key={vehicle.id}
                                        value={vehicle.id}
                                    >

                                        {vehicle.vehicle_name ||
                                            "Vehicle"}

                                        {vehicle.registration_number
                                            ? ` — ${vehicle.registration_number}`
                                            : ""}

                                    </option>

                                )
                            )}

                        </select>


                        <button
                            className="mr-generate"
                            disabled={
                                !selectedVehicleId ||
                                generating
                            }
                            onClick={
                                handleGenerateReport
                            }
                        >

                            <Assessment />

                            {generating
                                ? "Generating..."
                                : "Generate Report"}

                        </button>

                    </div>

                </section>


                {/* ==================================================
                    ERROR
                ================================================== */}

                {error && (

                    <div className="mr-error">
                        {error}
                    </div>

                )}


                {/* ==================================================
                    EMPTY STATE
                ================================================== */}

                {!selectedVehicle && (

                    <section className="mr-empty">

                        <div className="mr-empty-icon">
                            <Build />
                        </div>


                        <h2>
                            Generate a Maintenance Requirement Report
                        </h2>


                        <p>
                            Select a vehicle to analyze its AI
                            prediction, health condition and
                            maintenance history.
                        </p>

                    </section>

                )}


                {/* ==================================================
                    REPORT DOCUMENT
                ================================================== */}

                {selectedVehicle && (

                    <section className="mr-document">


                        {/* ==================================================
                            DOCUMENT HEADER
                        ================================================== */}

                        <header className="mr-document-header">

                            <div className="mr-brand">

                                <div className="mr-brand-icon">
                                    <DirectionsCar />
                                </div>


                                <div>

                                    <strong>
                                        SOBY ENGINEERS
                                    </strong>

                                    <span>
                                        SMART VEHICLE INTELLIGENCE
                                    </span>

                                </div>

                            </div>


                            <div className="mr-document-title">

                                <span>
                                    GENERATED REPORT
                                </span>

                                <strong>
                                    MAINTENANCE REQUIREMENT
                                </strong>

                            </div>

                        </header>


                        {/* ==================================================
                            VEHICLE INFORMATION
                        ================================================== */}

                        <section className="mr-vehicle">

                            <div className="mr-vehicle-main">

                                <div className="mr-car-icon">
                                    <DirectionsCar />
                                </div>


                                <div>

                                    <span>
                                        VEHICLE
                                    </span>


                                    <h2>
                                        {selectedVehicle.vehicle_name ||
                                            "Vehicle"}
                                    </h2>


                                    <p>
                                        {selectedVehicle.manufacturer ||
                                            "Manufacturer"}{" "}

                                        {selectedVehicle.model ||
                                            ""}
                                    </p>

                                </div>

                            </div>


                            <div className="mr-vehicle-details">

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
                                        CURRENT MILEAGE
                                    </span>

                                    <strong>

                                        {selectedVehicle.mileage !==
                                            undefined &&
                                        selectedVehicle.mileage !==
                                            null
                                            ? `${Number(
                                                selectedVehicle.mileage
                                            ).toLocaleString(
                                                "en-IN"
                                            )} km`
                                            : "Not Available"}

                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            REQUIREMENT STATUS
                        ================================================== */}

                        <section className="mr-status-section">


                            {/* HEALTH */}

                            <div className="mr-health">

                                <div
                                    className="mr-score-ring"
                                    style={{
                                        background:
                                            `conic-gradient(#17466f ${healthScore * 3.6}deg, #e5edf4 0deg)`,
                                    }}
                                >

                                    <div className="mr-score-inner">

                                        <strong>
                                            {healthScore.toFixed(1)}
                                        </strong>

                                        <span>
                                            HEALTH
                                        </span>

                                    </div>

                                </div>


                                <div>

                                    <span className="mr-label">
                                        VEHICLE HEALTH SCORE
                                    </span>


                                    <h2>
                                        {latestPrediction?.health_status ||
                                            (
                                                healthScore >= 80
                                                    ? "Healthy Condition"
                                                    : healthScore >= 60
                                                        ? "Good Condition"
                                                        : healthScore >= 40
                                                            ? "Needs Attention"
                                                            : "Critical Condition"
                                            )}
                                    </h2>


                                    <p>
                                        AI-generated health assessment
                                        based on historical and operational
                                        vehicle data.
                                    </p>

                                </div>

                            </div>


                            {/* REQUIREMENT */}

                            <div className="mr-requirement">

                                <span className="mr-label">
                                    MAINTENANCE REQUIREMENT
                                </span>


                                <div
                                    className={`mr-requirement-badge ${requirement.className}`}
                                >

                                    {requirement.icon}

                                    {requirement.label}

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            KEY METRICS
                        ================================================== */}

                        <section className="mr-metrics">


                            {/* AI CONFIDENCE */}

                            <div className="mr-metric">

                                <div className="mr-metric-icon blue">
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


                            {/* LAST SERVICE */}

                            <div className="mr-metric">

                                <div className="mr-metric-icon orange">
                                    <Build />
                                </div>


                                <div>

                                    <span>
                                        LAST SERVICE
                                    </span>

                                    <strong>
                                        {lastServiceDate}
                                    </strong>

                                </div>

                            </div>


                            {/* SERVICE TYPE */}

                            <div className="mr-metric">

                                <div className="mr-metric-icon green">
                                    <EventAvailable />
                                </div>


                                <div>

                                    <span>
                                        LAST SERVICE TYPE
                                    </span>

                                    <strong>
                                        {maintenanceType}
                                    </strong>

                                </div>

                            </div>


                            {/* MAINTENANCE RECORDS */}

                            <div className="mr-metric">

                                <div className="mr-metric-icon purple">
                                    <Assessment />
                                </div>


                                <div>

                                    <span>
                                        MAINTENANCE RECORDS
                                    </span>

                                    <strong>
                                        {vehicleMaintenance.length}
                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            AI PREDICTION
                        ================================================== */}

                        <section className="mr-section">

                            <div className="mr-heading">

                                <div className="mr-heading-icon">
                                    <AutoAwesome />
                                </div>


                                <div>

                                    <span>
                                        AI ANALYSIS
                                    </span>

                                    <h2>
                                        Maintenance Prediction
                                    </h2>

                                </div>

                            </div>


                            <div className="mr-prediction-grid">


                                {/* PREDICTION */}

                                <div className="mr-prediction-box">

                                    <span>
                                        MAINTENANCE REQUIRED
                                    </span>


                                    <strong>
                                        {latestPrediction
                                            ? String(
                                                latestPrediction
                                                    .maintenance_required
                                            )
                                            : "No prediction available"}
                                    </strong>

                                </div>


                                {/* PROBABILITY */}

                                <div className="mr-prediction-box">

                                    <span>
                                        AI CONFIDENCE
                                    </span>


                                    <strong>
                                        {confidence.toFixed(1)}%
                                    </strong>


                                    <div className="mr-progress">

                                        <div
                                            style={{
                                                width:
                                                    `${confidence}%`,
                                            }}
                                        />

                                    </div>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            RECOMMENDATION
                        ================================================== */}

                        <section className="mr-recommendation">

                            <div className="mr-recommendation-icon">
                                <Psychology />
                            </div>


                            <div>

                                <span>
                                    RECOMMENDED ACTION
                                </span>


                                <h3>
                                    Maintenance Guidance
                                </h3>


                                <p>
                                    {recommendation}
                                </p>

                            </div>

                        </section>


                        {/* ==================================================
                            VEHICLE DATA
                        ================================================== */}

                        <section className="mr-section">

                            <div className="mr-heading">

                                <div className="mr-heading-icon">
                                    <DirectionsCar />
                                </div>


                                <div>

                                    <span>
                                        VEHICLE INFORMATION
                                    </span>


                                    <h2>
                                        Vehicle Details
                                    </h2>

                                </div>

                            </div>


                            <div className="mr-data-grid">


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
                                        Registration
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

                                        {selectedVehicle.mileage !==
                                            undefined &&
                                        selectedVehicle.mileage !==
                                            null
                                            ? `${Number(
                                                selectedVehicle.mileage
                                            ).toLocaleString(
                                                "en-IN"
                                            )} km`
                                            : "Not Available"}

                                    </strong>

                                </div>

                            </div>

                        </section>


                        {/* ==================================================
                            FOOTER
                        ================================================== */}

                        <footer className="mr-footer">

                            <span>
                                Soby Engineers – AI-Driven Smart Vehicle
                                Intelligence and Predictive Maintenance Platform
                            </span>


                            <strong>
                                Maintenance Requirement Report
                            </strong>

                        </footer>

                    </section>

                )}

            </main>

        </div>
    );
};


export default MaintenanceRequirementReport;