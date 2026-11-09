import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Button,
    CircularProgress,
    Alert,
    Chip,
    Stack,
    Divider,
} from "@mui/material";

import {
    ArrowBack,
    Refresh,
    Psychology,
    DirectionsCar,
    CheckCircle,
    Warning,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./PredictionHistory.css";

interface Prediction {
    id: number;
    vehicle_id: number;
    health_score: number;
    predicted_issue: string;
    confidence: string | number;
    vehicle_name: string;
    model: string;
    registration_number: string;
    manufacturer: string;
    user_id: number;
}

const PredictionHistory: React.FC = () => {

    const navigate = useNavigate();

    const [predictions, setPredictions] =
        useState<Prediction[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const fetchHistory = async () => {

        try {

            setLoading(true);
            setError("");

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            console.log(
                "Fetching prediction history..."
            );

            const response = await fetch(
                "http://localhost:5000/api/predictions",
                {
                    method: "GET",
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            console.log(
                "Prediction History Status:",
                response.status
            );

            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            const data = await response.json();

            console.log(
                "Prediction History Response:",
                data
            );

            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load prediction history"
                );
            }

            const history =
                Array.isArray(data)
                    ? data
                    : data.predictions || [];

            setPredictions(history);

        } catch (err: any) {

            console.error(
                "Prediction History Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load prediction history."
            );

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    const getHealthColor = (
        score: number
    ) => {

        if (score >= 80)
            return "#168653";

        if (score >= 60)
            return "#b8860b";

        if (score >= 40)
            return "#d97706";

        return "#b42318";
    };

    const getHealthStatus = (
        score: number
    ) => {

        if (score >= 80)
            return "Excellent";

        if (score >= 60)
            return "Good";

        if (score >= 40)
            return "Needs Attention";

        return "Critical";
    };

    return (
        <Box className="prediction-history-page">

            {/* HEADER */}

            <Paper
                elevation={0}
                className="prediction-history-header"
            >

                <Box className="history-title-section">

                    <Box className="history-icon">
                        <Psychology />
                    </Box>

                    <Box>

                        <Typography className="history-title">
                            Prediction History
                        </Typography>

                        <Typography className="history-subtitle">
                            View previous AI-generated vehicle health predictions
                        </Typography>

                    </Box>

                </Box>

                <Stack
                    direction="row"
                    spacing={1}
                    flexWrap="wrap"
                >

                    <Button
                        variant="outlined"
                        startIcon={<ArrowBack />}
                        onClick={() =>
                            navigate(
                                "/ai-prediction"
                            )
                        }
                        className="history-button"
                    >
                        AI Prediction
                    </Button>

                    <Button
                        variant="contained"
                        startIcon={<Refresh />}
                        onClick={fetchHistory}
                        disabled={loading}
                        className="history-refresh-button"
                    >
                        Refresh
                    </Button>

                </Stack>

            </Paper>


            {/* ERROR */}

            {error && (
                <Alert
                    severity="error"
                    className="history-alert"
                >
                    {error}
                </Alert>
            )}


            {/* MAIN */}

            <Paper
                elevation={0}
                className="history-card"
            >

                {/* SUMMARY */}

                <Box className="history-summary">

                    <Box className="summary-item">

                        <DirectionsCar />

                        <Box>

                            <Typography className="summary-label">
                                TOTAL PREDICTIONS
                            </Typography>

                            <Typography className="summary-value">
                                {predictions.length}
                            </Typography>

                        </Box>

                    </Box>


                    <Box className="summary-item">

                        <CheckCircle />

                        <Box>

                            <Typography className="summary-label">
                                HEALTHY
                            </Typography>

                            <Typography className="summary-value">
                                {
                                    predictions.filter(
                                        (item) =>
                                            Number(
                                                item.health_score
                                            ) >= 80
                                    ).length
                                }
                            </Typography>

                        </Box>

                    </Box>


                    <Box className="summary-item">

                        <Warning />

                        <Box>

                            <Typography className="summary-label">
                                NEEDS ATTENTION
                            </Typography>

                            <Typography className="summary-value">
                                {
                                    predictions.filter(
                                        (item) =>
                                            Number(
                                                item.health_score
                                            ) < 80
                                    ).length
                                }
                            </Typography>

                        </Box>

                    </Box>

                </Box>


                <Divider
                    sx={{
                        margin: "25px 0",
                    }}
                />


                {/* LOADING */}

                {loading && (

                    <Box className="history-loading">

                        <CircularProgress />

                        <Typography>
                            Loading prediction history...
                        </Typography>

                    </Box>

                )}


                {/* EMPTY */}

                {!loading &&
                    predictions.length === 0 &&
                    !error && (

                        <Box className="history-empty">

                            <Psychology />

                            <Typography>
                                No prediction history found.
                            </Typography>

                            <Button
                                variant="contained"
                                onClick={() =>
                                    navigate(
                                        "/ai-prediction"
                                    )
                                }
                            >
                                Run AI Prediction
                            </Button>

                        </Box>

                    )}


                {/* TABLE */}

                {!loading &&
                    predictions.length > 0 && (

                        <Box
                            className="history-table-wrapper"
                        >

                            <table className="history-table">

                                <thead>

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Vehicle
                                        </th>

                                        <th>
                                            Registration
                                        </th>

                                        <th>
                                            Health Score
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Prediction
                                        </th>

                                        <th>
                                            Confidence
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {predictions.map(
                                        (
                                            prediction,
                                            index
                                        ) => {

                                            const score =
                                                Number(
                                                    prediction.health_score
                                                );

                                            const issue =
                                                String(
                                                    prediction.predicted_issue
                                                );

                                            return (

                                                <tr
                                                    key={
                                                        prediction.id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>

                                                    <td>

                                                        <Box>

                                                            <Typography className="vehicle-name">
                                                                {
                                                                    prediction.vehicle_name
                                                                }
                                                            </Typography>

                                                            <Typography className="vehicle-model">
                                                                {
                                                                    prediction.manufacturer
                                                                }{" "}
                                                                {
                                                                    prediction.model
                                                                }
                                                            </Typography>

                                                        </Box>

                                                    </td>

                                                    <td>
                                                        {
                                                            prediction.registration_number
                                                        }
                                                    </td>

                                                    <td>

                                                        <Typography
                                                            className="health-score"
                                                            sx={{
                                                                color:
                                                                    getHealthColor(
                                                                        score
                                                                    ),
                                                            }}
                                                        >
                                                            {score}/100
                                                        </Typography>

                                                    </td>

                                                    <td>

                                                        <Chip
                                                            label={
                                                                getHealthStatus(
                                                                    score
                                                                )
                                                            }
                                                            size="small"
                                                            sx={{
                                                                color:
                                                                    getHealthColor(
                                                                        score
                                                                    ),
                                                                backgroundColor:
                                                                    `${getHealthColor(
                                                                        score
                                                                    )}18`,
                                                                fontWeight:
                                                                    700,
                                                            }}
                                                        />

                                                    </td>

                                                    <td>

                                                        <Chip
                                                            label={
                                                                issue
                                                                    .toLowerCase() ===
                                                                "yes"
                                                                    ? "Maintenance Required"
                                                                    : "No Maintenance"
                                                            }
                                                            size="small"
                                                            sx={{
                                                                fontWeight:
                                                                    700,
                                                                color:
                                                                    issue
                                                                        .toLowerCase() ===
                                                                    "yes"
                                                                        ? "#b42318"
                                                                        : "#168653",
                                                                backgroundColor:
                                                                    issue
                                                                        .toLowerCase() ===
                                                                    "yes"
                                                                        ? "#b4231815"
                                                                        : "#16865315",
                                                            }}
                                                        />

                                                    </td>

                                                    <td>

                                                        {Number(
                                                            prediction.confidence
                                                        ).toFixed(
                                                            2
                                                        )}
                                                        %

                                                    </td>

                                                </tr>

                                            );

                                        }
                                    )}

                                </tbody>

                            </table>

                        </Box>

                    )}

            </Paper>

        </Box>
    );
};

export default PredictionHistory;