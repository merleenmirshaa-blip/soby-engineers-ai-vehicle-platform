import React, { useEffect, useState } from "react";

import {
    Box,
    Card,
    CardContent,
    Typography,
    Chip,
    CircularProgress,
    Alert,
    Button,
} from "@mui/material";

import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import RefreshIcon from "@mui/icons-material/Refresh";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import ImageIcon from "@mui/icons-material/Image";

import "./ImageAIHistory.css";


// ==========================================
// IMAGE PREDICTION TYPE
// ==========================================

interface ImagePrediction {
    id: number;
    user_id: number;
    vehicle_id: number | null;

    image_name: string;

    prediction: string;

    confidence: number;

    recommendation: string | null;

    created_at: string;

    vehicle_name?: string | null;

    registration_number?: string | null;
}


// ==========================================
// COMPONENT
// ==========================================

const ImageAIHistory: React.FC = () => {

    // ==========================================
    // STATE
    // ==========================================

    const [predictions, setPredictions] =
        useState<ImagePrediction[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ==========================================
    // FETCH HISTORY
    // ==========================================

    const fetchHistory = async () => {

        setLoading(true);

        setError("");

        try {

            const token =
                localStorage.getItem("token");

            if (!token) {

                throw new Error(
                    "Authentication token not found. Please login again."
                );
            }


            const response =
                await fetch(
                    "http://localhost:5000/api/image-predictions",
                    {
                        method: "GET",

                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );


            const data =
                await response.json();


            if (
                !response.ok ||
                !data.success
            ) {

                throw new Error(
                    data.message ||
                    data.error ||
                    "Failed to load image prediction history."
                );
            }


            setPredictions(
                data.predictions || []
            );

        } catch (error: any) {

            console.error(
                "Image AI History Error:",
                error
            );

            setError(
                error.message ||
                "Unable to load image AI history."
            );

        } finally {

            setLoading(false);

        }
    };


    // ==========================================
    // LOAD ON PAGE OPEN
    // ==========================================

    useEffect(() => {

        fetchHistory();

    }, []);


    // ==========================================
    // FORMAT DATE
    // ==========================================

    const formatDate = (
        dateString: string
    ) => {

        const date =
            new Date(dateString);

        return date.toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // ==========================================
    // PREDICTION ICON
    // ==========================================

    const getPredictionIcon = (
        prediction: string
    ) => {

        if (
            prediction.toLowerCase() ===
            "normal"
        ) {

            return (
                <CheckCircleIcon
                    className="history-normal-icon"
                />
            );

        }

        return (
            <WarningIcon
                className="history-damaged-icon"
            />
        );
    };


    // ==========================================
    // PREDICTION CHIP
    // ==========================================

    const getPredictionChip = (
        prediction: string
    ) => {

        if (
            prediction.toLowerCase() ===
            "normal"
        ) {

            return (
                <Chip
                    label="Normal"
                    className="history-normal-chip"
                />
            );

        }

        return (
            <Chip
                label="Damaged"
                className="history-damaged-chip"
            />
        );
    };


    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {

        return (

            <Box className="image-history-page">

                <Box className="history-loading">

                    <CircularProgress />

                    <Typography>
                        Loading Image AI history...
                    </Typography>

                </Box>

            </Box>

        );
    }


    // ==========================================
    // PAGE
    // ==========================================

    return (

        <Box className="image-history-page">

            {/* =====================================
                HEADER
            ====================================== */}

            <Box className="image-history-header">

                <Box className="history-header-left">

                    <Box className="history-header-icon">

                        <PsychologyIcon />

                    </Box>

                    <Box>

                        <Typography className="history-title">
                            Image AI History
                        </Typography>

                        <Typography className="history-subtitle">
                            View your previous vehicle image
                            condition analyses and AI recommendations.
                        </Typography>

                    </Box>

                </Box>


                <Button
                    variant="outlined"
                    startIcon={<RefreshIcon />}
                    className="history-refresh-button"
                    onClick={fetchHistory}
                >
                    Refresh
                </Button>

            </Box>


            {/* =====================================
                ERROR
            ====================================== */}

            {error && (

                <Alert
                    severity="error"
                    className="history-alert"
                >
                    {error}
                </Alert>

            )}


            {/* =====================================
                EMPTY STATE
            ====================================== */}

            {!error &&
                predictions.length === 0 && (

                    <Card className="history-empty-card">

                        <CardContent>

                            <ImageIcon
                                className="history-empty-icon"
                            />

                            <Typography className="history-empty-title">
                                No Image AI Analyses Yet
                            </Typography>

                            <Typography className="history-empty-text">
                                You have not saved any vehicle
                                image analysis results yet.
                            </Typography>

                        </CardContent>

                    </Card>

                )}


            {/* =====================================
                HISTORY LIST
            ====================================== */}

            {predictions.length > 0 && (

                <Box className="history-list">

                    {predictions.map(
                        (item) => (

                            <Card
                                key={item.id}
                                className="history-card"
                            >

                                <CardContent>

                                    {/* ==========================
                                        TOP SECTION
                                    =========================== */}

                                    <Box className="history-card-top">

                                        <Box className="history-image-icon">

                                            <ImageIcon />

                                        </Box>


                                        <Box className="history-file-section">

                                            <Typography className="history-file-name">

                                                {item.image_name}

                                            </Typography>

                                            <Typography className="history-date">

                                                {formatDate(
                                                    item.created_at
                                                )}

                                            </Typography>

                                        </Box>


                                        <Box className="history-condition">

                                            {getPredictionIcon(
                                                item.prediction
                                            )}

                                            {getPredictionChip(
                                                item.prediction
                                            )}

                                        </Box>

                                    </Box>


                                    {/* ==========================
                                        VEHICLE
                                    =========================== */}

                                    <Box className="history-vehicle">

                                        <DirectionsCarIcon />

                                        <Box>

                                            <Typography className="history-info-label">
                                                Vehicle
                                            </Typography>

                                            <Typography className="history-info-value">

                                                {item.vehicle_name
                                                    ? item.vehicle_name
                                                    : "Vehicle not specified"}

                                            </Typography>

                                            {item.registration_number && (

                                                <Typography className="history-registration">

                                                    {item.registration_number}

                                                </Typography>

                                            )}

                                        </Box>

                                    </Box>


                                    {/* ==========================
                                        CONFIDENCE
                                    =========================== */}

                                    <Box className="history-confidence">

                                        <Box className="history-confidence-header">

                                            <Typography className="history-info-label">
                                                AI Confidence
                                            </Typography>

                                            <Typography className="history-confidence-value">

                                                {item.confidence}%

                                            </Typography>

                                        </Box>

                                        <Box className="history-confidence-track">

                                            <Box
                                                className="history-confidence-fill"
                                                style={{
                                                    width: `${Math.min(
                                                        Math.max(
                                                            Number(
                                                                item.confidence
                                                            ),
                                                            0
                                                        ),
                                                        100
                                                    )}%`,
                                                }}
                                            />

                                        </Box>

                                    </Box>


                                    {/* ==========================
                                        RECOMMENDATION
                                    =========================== */}

                                    {item.recommendation && (

                                        <Box className="history-recommendation">

                                            <Typography className="history-recommendation-title">
                                                AI Recommendation
                                            </Typography>

                                            <Typography className="history-recommendation-text">

                                                {item.recommendation}

                                            </Typography>

                                        </Box>

                                    )}

                                </CardContent>

                            </Card>

                        )
                    )}

                </Box>

            )}

        </Box>

    );
};

export default ImageAIHistory;