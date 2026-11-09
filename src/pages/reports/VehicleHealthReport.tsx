import React, { useEffect, useMemo, useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    Select,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    DirectionsCar,
    Favorite,
    Psychology,
    Build,
    Speed,
    CalendarMonth,
    CheckCircle,
    WarningAmber,
    ErrorOutlined,
    TrendingUp,
    AutoAwesome,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./VehicleHealthReport.css";

interface Vehicle {
    id: number;
    vehicle_name: string;
    model: string;
    registration_number: string;
    manufacturer?: string;
    fuel_type?: string;
    mileage?: number;
    vehicle_usage?: string;
}

interface Prediction {
    id: number;
    vehicle_id: number;
    health_score: number;
    predicted_issue?: string;
    confidence?: number | string;
    vehicle_name?: string;
    model?: string;
    registration_number?: string;
}

const VehicleHealthReport: React.FC = () => {
    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [predictions, setPredictions] = useState<Prediction[]>([]);

    const [selectedVehicle, setSelectedVehicle] =
        useState<string>("");

    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);

    const [showReport, setShowReport] = useState(false);

    const token = localStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);

                const headers = {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                };

                const [vehicleResponse, predictionResponse] =
                    await Promise.all([
                        fetch(
                            "http://localhost:5000/api/vehicles",
                            { headers }
                        ),
                        fetch(
                            "http://localhost:5000/api/predictions",
                            { headers }
                        ),
                    ]);

                const vehicleData =
                    await vehicleResponse.json();

                const predictionData =
                    await predictionResponse.json();

                const vehicleList = Array.isArray(vehicleData)
                    ? vehicleData
                    : vehicleData.vehicles || [];

                const predictionList = Array.isArray(
                    predictionData
                )
                    ? predictionData
                    : predictionData.predictions || [];

                setVehicles(vehicleList);
                setPredictions(predictionList);
            } catch (error) {
                console.error(
                    "Vehicle Health Report Error:",
                    error
                );
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const vehicle = useMemo(() => {
        return vehicles.find(
            (item) =>
                item.id.toString() === selectedVehicle
        );
    }, [vehicles, selectedVehicle]);

    const vehiclePredictions = useMemo(() => {
        if (!vehicle) return [];

        return predictions.filter(
            (item) =>
                Number(item.vehicle_id) ===
                Number(vehicle.id)
        );
    }, [predictions, vehicle]);

    const latestPrediction = useMemo(() => {
        if (vehiclePredictions.length === 0) {
            return null;
        }

        return [...vehiclePredictions].sort(
            (a, b) => Number(b.id) - Number(a.id)
        )[0];
    }, [vehiclePredictions]);

    const healthScore = latestPrediction
        ? Number(latestPrediction.health_score)
        : 0;

    const confidence = latestPrediction
        ? Number(latestPrediction.confidence || 0)
        : 0;

    const healthStatus = useMemo(() => {
        if (healthScore >= 80) {
            return {
                label: "Excellent",
                className: "health-excellent",
                icon: <CheckCircle />,
            };
        }

        if (healthScore >= 60) {
            return {
                label: "Good",
                className: "health-good",
                icon: <CheckCircle />,
            };
        }

        if (healthScore >= 40) {
            return {
                label: "Needs Attention",
                className: "health-warning",
                icon: <WarningAmber />,
            };
        }

        return {
            label: "Critical",
            className: "health-critical",
            icon: <ErrorOutlined />,
        };
    }, [healthScore]);

    const generateReport = () => {
        if (!selectedVehicle) return;

        setGenerating(true);

        setTimeout(() => {
            setShowReport(true);
            setGenerating(false);
        }, 500);
    };

    const getHealthMessage = () => {
        if (healthScore >= 80) {
            return "The vehicle is currently showing a healthy condition based on the available operational and maintenance data.";
        }

        if (healthScore >= 60) {
            return "The vehicle is in generally good condition, but regular maintenance should continue to preserve its health.";
        }

        if (healthScore >= 40) {
            return "The vehicle requires attention. Reviewing maintenance requirements and recent vehicle usage is recommended.";
        }

        return "The vehicle shows a critical health condition. Immediate maintenance inspection should be considered.";
    };

    const getRecommendation = () => {
        if (!latestPrediction) {
            return "Run an AI prediction to generate maintenance recommendations.";
        }

        if (latestPrediction.predicted_issue === "Yes") {
            return "AI analysis indicates that maintenance may be required. Review the vehicle and schedule appropriate service.";
        }

        return "AI analysis does not currently indicate a maintenance requirement. Continue regular servicing and monitoring.";
    };

    if (loading) {
        return (
            <Box className="health-loading">
                <CircularProgress />
                <Typography>
                    Loading vehicle health data...
                </Typography>
            </Box>
        );
    }

    return (
        <Box className="vehicle-health-page">

            {/* TOP BAR */}
            <Box className="health-topbar">

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/reports")}
                    className="health-back-button"
                >
                    Reports
                </Button>

                <Box className="health-top-icon">
                    <Favorite />
                </Box>

            </Box>


            {/* HERO */}
            <Box className="health-hero">

                <Box className="health-hero-content">

                    <Typography className="health-eyebrow">
                        VEHICLE INTELLIGENCE
                    </Typography>

                    <Typography className="health-title">
                        Vehicle Health Report
                    </Typography>

                    <Typography className="health-description">
                        Analyze vehicle condition through AI-generated
                        health scores, prediction results and maintenance
                        indicators.
                    </Typography>

                </Box>

                <Box className="health-hero-visual">

                    <div className="health-orbit health-orbit-one" />
                    <div className="health-orbit health-orbit-two" />

                    <Favorite className="health-hero-icon" />

                </Box>

            </Box>


            {/* SELECTOR */}
            <Box className="health-selector-section">

                <Box className="health-selector-heading">

                    <Typography className="health-selector-label">
                        VEHICLE SELECTION
                    </Typography>

                    <Typography className="health-selector-title">
                        Choose a vehicle
                    </Typography>

                    <Typography className="health-selector-description">
                        Select a vehicle to generate its latest
                        health analysis.
                    </Typography>

                </Box>


                <Box className="health-selector-controls">

                    <Select
                        value={selectedVehicle}
                        onChange={(event) => {
                            setSelectedVehicle(
                                event.target.value
                            );
                            setShowReport(false);
                        }}
                        displayEmpty
                        className="health-select"
                    >

                        <MenuItem value="">
                            Select vehicle
                        </MenuItem>

                        {vehicles.map((item) => (
                            <MenuItem
                                key={item.id}
                                value={item.id.toString()}
                            >
                                {item.vehicle_name} —{" "}
                                {item.model} —{" "}
                                {item.registration_number}
                            </MenuItem>
                        ))}

                    </Select>


                    <Button
                        onClick={generateReport}
                        disabled={
                            !selectedVehicle ||
                            generating
                        }
                        className="generate-health-button"
                    >
                        {generating ? (
                            <>
                                <CircularProgress
                                    size={18}
                                    color="inherit"
                                />
                                Generating...
                            </>
                        ) : (
                            <>
                                <AutoAwesome />
                                Generate Report
                            </>
                        )}
                    </Button>

                </Box>

            </Box>


            {/* EMPTY STATE */}
            {!showReport && (
                <Box className="health-empty-state">

                    <Box className="health-empty-icon">
                        <DirectionsCar />
                    </Box>

                    <Typography className="health-empty-title">
                        Ready to analyze vehicle health
                    </Typography>

                    <Typography className="health-empty-text">
                        Select a vehicle above and generate a
                        health report to view its latest AI-based
                        condition analysis.
                    </Typography>

                </Box>
            )}


            {/* REPORT */}
            {showReport && vehicle && (
                <Box className="health-report-container">

                    {/* VEHICLE HEADER */}
                    <Box className="health-vehicle-header">

                        <Box className="health-vehicle-main">

                            <Box className="health-car-icon">
                                <DirectionsCar />
                            </Box>

                            <Box>

                                <Typography className="health-vehicle-name">
                                    {vehicle.vehicle_name}
                                </Typography>

                                <Typography className="health-vehicle-subtitle">
                                    {vehicle.manufacturer || ""}
                                    {" "}
                                    {vehicle.model}
                                </Typography>

                                <Typography className="health-registration">
                                    {vehicle.registration_number}
                                </Typography>

                            </Box>

                        </Box>

                        <Box className="health-report-badge">
                            <Favorite />
                            HEALTH ANALYSIS
                        </Box>

                    </Box>


                    {/* HEALTH SCORE */}
                    <Box className="health-main-analysis">

                        <Box className="health-score-section">

                            <Typography className="analysis-label">
                                VEHICLE HEALTH SCORE
                            </Typography>

                            <Box className="health-score-ring">

                                <Box className="health-score-inner">

                                    <Typography className="health-score-number">
                                        {healthScore}
                                    </Typography>

                                    <Typography className="health-score-total">
                                        / 100
                                    </Typography>

                                </Box>

                            </Box>

                            <Box
                                className={`health-status ${healthStatus.className}`}
                            >
                                {healthStatus.icon}
                                {healthStatus.label}
                            </Box>

                        </Box>


                        <Box className="health-analysis-content">

                            <Typography className="analysis-title">
                                Current Vehicle Condition
                            </Typography>

                            <Typography className="analysis-description">
                                {getHealthMessage()}
                            </Typography>


                            <Box className="health-progress-area">

                                <Box className="health-progress-header">

                                    <Typography>
                                        Health condition
                                    </Typography>

                                    <Typography>
                                        {healthScore}%
                                    </Typography>

                                </Box>

                                <Box className="health-progress-track">

                                    <Box
                                        className={`health-progress-fill ${healthStatus.className}`}
                                        style={{
                                            width: `${Math.max(
                                                0,
                                                Math.min(
                                                    healthScore,
                                                    100
                                                )
                                            )}%`,
                                        }}
                                    />

                                </Box>

                            </Box>


                            <Box className="health-condition-note">

                                {healthStatus.icon}

                                <Typography>
                                    {getRecommendation()}
                                </Typography>

                            </Box>

                        </Box>

                    </Box>


                    {/* STATS */}
                    <Box className="health-stats">

                        <Box className="health-stat">

                            <Box className="health-stat-icon">
                                <Speed />
                            </Box>

                            <Box>
                                <Typography className="health-stat-label">
                                    Mileage
                                </Typography>

                                <Typography className="health-stat-value">
                                    {Number(
                                        vehicle.mileage || 0
                                    ).toLocaleString()} km
                                </Typography>
                            </Box>

                        </Box>


                        <Box className="health-stat">

                            <Box className="health-stat-icon">
                                <Psychology />
                            </Box>

                            <Box>
                                <Typography className="health-stat-label">
                                    AI Confidence
                                </Typography>

                                <Typography className="health-stat-value">
                                    {confidence.toFixed(1)}%
                                </Typography>
                            </Box>

                        </Box>


                        <Box className="health-stat">

                            <Box className="health-stat-icon">
                                <Build />
                            </Box>

                            <Box>
                                <Typography className="health-stat-label">
                                    Maintenance
                                </Typography>

                                <Typography className="health-stat-value">
                                    {latestPrediction?.predicted_issue ===
                                    "Yes"
                                        ? "Required"
                                        : "Not Required"}
                                </Typography>
                            </Box>

                        </Box>


                        <Box className="health-stat">

                            <Box className="health-stat-icon">
                                <CalendarMonth />
                            </Box>

                            <Box>
                                <Typography className="health-stat-label">
                                    Analysis Records
                                </Typography>

                                <Typography className="health-stat-value">
                                    {vehiclePredictions.length}
                                </Typography>
                            </Box>

                        </Box>

                    </Box>


                    {/* CONDITION INDICATORS */}
                    <Box className="health-section">

                        <Box className="health-section-heading">

                            <Box>
                                <Typography className="health-section-label">
                                    VEHICLE CONDITION
                                </Typography>

                                <Typography className="health-section-title">
                                    Health indicators
                                </Typography>
                            </Box>

                            <TrendingUp className="health-heading-icon" />

                        </Box>


                        <Box className="indicator-grid">

                            <Box className="indicator-item">

                                <Box className="indicator-top">

                                    <Typography>
                                        Overall Health
                                    </Typography>

                                    <Typography>
                                        {healthScore}%
                                    </Typography>

                                </Box>

                                <Box className="indicator-track">
                                    <Box
                                        className={`indicator-fill ${healthStatus.className}`}
                                        style={{
                                            width: `${healthScore}%`,
                                        }}
                                    />
                                </Box>

                            </Box>


                            <Box className="indicator-item">

                                <Box className="indicator-top">

                                    <Typography>
                                        AI Confidence
                                    </Typography>

                                    <Typography>
                                        {confidence.toFixed(1)}%
                                    </Typography>

                                </Box>

                                <Box className="indicator-track">
                                    <Box
                                        className="indicator-fill"
                                        style={{
                                            width: `${Math.min(
                                                confidence,
                                                100
                                            )}%`,
                                        }}
                                    />
                                </Box>

                            </Box>


                            <Box className="indicator-item">

                                <Box className="indicator-top">

                                    <Typography>
                                        Maintenance Status
                                    </Typography>

                                    <Typography>
                                        {latestPrediction?.predicted_issue ===
                                        "Yes"
                                            ? "Attention"
                                            : "Stable"}
                                    </Typography>

                                </Box>

                                <Box className="indicator-track">
                                    <Box
                                        className={`indicator-fill ${
                                            latestPrediction?.predicted_issue ===
                                            "Yes"
                                                ? "indicator-warning"
                                                : "indicator-good"
                                        }`}
                                        style={{
                                            width:
                                                latestPrediction?.predicted_issue ===
                                                "Yes"
                                                    ? "55%"
                                                    : "88%",
                                        }}
                                    />
                                </Box>

                            </Box>

                        </Box>

                    </Box>


                    {/* AI INSIGHT */}
                    <Box className="health-insight">

                        <Box className="insight-icon">
                            <Psychology />
                        </Box>

                        <Box>

                            <Typography className="insight-label">
                                AI VEHICLE INSIGHT
                            </Typography>

                            <Typography className="insight-title">
                                {latestPrediction
                                    ? latestPrediction.predicted_issue ===
                                      "Yes"
                                        ? "Maintenance attention detected"
                                        : "Vehicle condition currently stable"
                                    : "AI analysis unavailable"}
                            </Typography>

                            <Typography className="insight-text">
                                {getRecommendation()}
                            </Typography>

                        </Box>

                    </Box>


                    {/* FOOTER */}
                    <Box className="health-report-footer">

                        <Typography>
                            Generated from historical and operational
                            vehicle data.
                        </Typography>

                        <Box>
                            <Favorite />
                            AI POWERED
                        </Box>

                    </Box>

                </Box>
            )}

        </Box>
    );
};

export default VehicleHealthReport;