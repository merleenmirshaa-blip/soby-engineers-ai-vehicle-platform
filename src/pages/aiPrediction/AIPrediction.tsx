import React, { useEffect, useState } from "react";

import {
    Box,
    Typography,
    Paper,
    Button,
    MenuItem,
    TextField,
    CircularProgress,
    Alert,
    Chip,
    Divider,
    Stack,
} from "@mui/material";

import {
    Psychology,
    DirectionsCar,
    ArrowBack,
    History,
    AutoAwesome,
    Favorite,
    Build,
    Refresh,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./AIPrediction.css";


/* =========================================================
   TYPES
========================================================= */

interface Vehicle {
    id: number;
    user_id: number;
    vehicle_name: string;
    model: string;
    registration_number: string;
    manufacturer: string;
    fuel_type: string;
    mileage: number;
    engine_type?: string;
    vehicle_usage?: string;
}


interface PredictionResult {
    health_score: number;
    health_status: string;
    maintenance_probability: number;
    prediction: string;
    recommendation: string;
    success?: boolean;
}


/* =========================================================
   COMPONENT
========================================================= */

const AIPrediction: React.FC = () => {

    const navigate = useNavigate();


    /* =====================================================
       STATE
    ===================================================== */

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState("");


    const [result, setResult] =
        useState<PredictionResult | null>(null);


    const [loadingVehicles, setLoadingVehicles] =
        useState(true);


    const [predicting, setPredicting] =
        useState(false);


    const [error, setError] =
        useState("");


    /* =====================================================
       FETCH VEHICLES
    ===================================================== */

    const fetchVehicles = async () => {

        try {

            setLoadingVehicles(true);
            setError("");

            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;
            }


            const response = await fetch(
                "http://localhost:5000/api/vehicles",
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


            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "Failed to load vehicles"
                );

            }


            /*
             * Your vehicle API returns an array.
             * This also handles { vehicles: [...] }.
             */

            const vehicleList =
                Array.isArray(data)
                    ? data
                    : data.vehicles || [];


            setVehicles(vehicleList);


            if (
                vehicleList.length > 0 &&
                !selectedVehicleId
            ) {

                setSelectedVehicleId(
                    String(vehicleList[0].id)
                );

            }

        }

        catch (err: any) {

            console.error(
                "Vehicle Loading Error:",
                err
            );

            setError(
                err.message ||
                "Unable to load vehicles."
            );

        }

        finally {

            setLoadingVehicles(false);

        }

    };


    /* =====================================================
       LOAD VEHICLES
    ===================================================== */

    useEffect(() => {

        fetchVehicles();

    }, []);


    /* =====================================================
       RUN AI PREDICTION
    ===================================================== */

    const handlePrediction = async () => {

        if (!selectedVehicleId) {

            setError(
                "Please select a vehicle first."
            );

            return;
        }


        try {

            setPredicting(true);

            setError("");

            setResult(null);


            const token =
                localStorage.getItem("token");


            if (!token) {

                navigate("/login");

                return;
            }


            const response = await fetch(
                `http://localhost:5000/api/ai/vehicle/${selectedVehicleId}/predict`,
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


            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }


            const data =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    data.message ||
                    "AI prediction failed."
                );

            }


            console.log(
                "AI Prediction Result:",
                data
            );


            /*
             * Backend may return the result
             * directly or inside data.result.
             */

            const prediction =
                data.result || data;


            setResult({

                health_score:
                    Number(
                        prediction.health_score ?? 0
                    ),

                health_status:
                    prediction.health_status ||
                    "Unknown",

                maintenance_probability:
                    Number(
                        prediction.maintenance_probability ??
                        0
                    ),

                prediction:
                    prediction.prediction ||
                    "No",

                recommendation:
                    prediction.recommendation ||
                    "Continue regular vehicle monitoring.",

                success:
                    prediction.success !== false,

            });

        }

        catch (err: any) {

            console.error(
                "AI Prediction Error:",
                err
            );

            setError(
                err.message ||
                "Unable to generate AI prediction."
            );

        }

        finally {

            setPredicting(false);

        }

    };


    /* =====================================================
       HEALTH COLOR
    ===================================================== */

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


    /* =====================================================
       HEALTH STATUS
    ===================================================== */

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


    /* =====================================================
       SELECTED VEHICLE
    ===================================================== */

    const selectedVehicle =
        vehicles.find(
            (vehicle) =>
                String(vehicle.id) ===
                String(selectedVehicleId)
        );


    /* =====================================================
       UI
    ===================================================== */

    return (

        <Box
            sx={{
                minHeight: "100vh",
                background: "#f4f7fc",
                padding: {
                    xs: 2,
                    md: 4,
                },
            }}
        >


            {/* =================================================
                HEADER
            ================================================= */}

            <Paper
                elevation={0}
                sx={{
                    maxWidth: 1400,
                    margin: "0 auto 24px",
                    padding: {
                        xs: 2,
                        md: 3,
                    },
                    borderRadius: "20px",
                    border:
                        "1px solid #e3eaf3",
                    background: "#ffffff",
                }}
            >

                <Stack
                    direction={{
                        xs: "column",
                        md: "row",
                    }}
                    alignItems={{
                        xs: "flex-start",
                        md: "center",
                    }}
                    justifyContent="space-between"
                    spacing={2}
                >


                    {/* TITLE */}

                    <Stack
                        direction="row"
                        spacing={2}
                        alignItems="center"
                    >

                        <Box
                            sx={{
                                width: 55,
                                height: 55,
                                borderRadius: "16px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "#ffffff",
                                background:
                                    "linear-gradient(135deg,#063b88,#0874e8)",
                                boxShadow:
                                    "0 10px 25px rgba(7,89,190,0.22)",
                            }}
                        >

                            <Psychology
                                sx={{
                                    fontSize: 30,
                                }}
                            />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    color: "#10243f",
                                    fontSize: {
                                        xs: 22,
                                        md: 27,
                                    },
                                    fontWeight: 800,
                                }}
                            >
                                AI Vehicle Prediction
                            </Typography>


                            <Typography
                                sx={{
                                    color: "#7b899d",
                                    fontSize: 13,
                                    marginTop: 0.5,
                                }}
                            >
                                Analyze vehicle health using AI-powered predictive maintenance
                            </Typography>

                        </Box>

                    </Stack>


                    {/* HEADER BUTTONS */}

                    <Stack
                        direction="row"
                        spacing={1}
                        flexWrap="wrap"
                    >

                        <Button
                            variant="outlined"
                            startIcon={<ArrowBack />}
                            onClick={() =>
                                navigate("/dashboard")
                            }
                            sx={{
                                borderColor:
                                    "#075fd0",
                                color:
                                    "#075fd0",
                                textTransform:
                                    "none",
                                borderRadius:
                                    "10px",
                                fontWeight:
                                    700,
                            }}
                        >
                            Dashboard
                        </Button>


                        <Button
                            variant="outlined"
                            startIcon={<History />}
                            onClick={() =>
                                navigate(
                                    "/prediction-history"
                                )
                            }
                            sx={{
                                borderColor:
                                    "#075fd0",
                                color:
                                    "#075fd0",
                                textTransform:
                                    "none",
                                borderRadius:
                                    "10px",
                                fontWeight:
                                    700,
                            }}
                        >
                            Prediction History
                        </Button>

                    </Stack>

                </Stack>

            </Paper>



            {/* =================================================
                MAIN CONTENT
            ================================================= */}

            <Box
                sx={{
                    maxWidth: 1400,
                    margin: "0 auto",
                }}
            >


                {/* ERROR */}

                {error && (

                    <Alert
                        severity="error"
                        sx={{
                            marginBottom: 3,
                            borderRadius: "12px",
                        }}
                    >
                        {error}
                    </Alert>

                )}



                {/* =================================================
                    VEHICLE SELECTION CARD
                ================================================= */}

                <Paper
                    elevation={0}
                    sx={{
                        padding: {
                            xs: 2.5,
                            md: 4,
                        },
                        borderRadius: "22px",
                        border:
                            "1px solid #e3eaf3",
                        background: "#ffffff",
                        marginBottom: 3,
                    }}
                >

                    <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                        sx={{
                            marginBottom: 3,
                        }}
                    >

                        <Box
                            sx={{
                                width: 45,
                                height: 45,
                                borderRadius: "13px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background:
                                    "#edf5ff",
                                color:
                                    "#075fd0",
                            }}
                        >

                            <DirectionsCar />

                        </Box>


                        <Box>

                            <Typography
                                sx={{
                                    fontSize: 18,
                                    fontWeight: 800,
                                    color:
                                        "#10243f",
                                }}
                            >
                                Select Vehicle
                            </Typography>

                            <Typography
                                sx={{
                                    fontSize: 12,
                                    color:
                                        "#7b899d",
                                }}
                            >
                                Select a registered vehicle to analyze
                            </Typography>

                        </Box>

                    </Stack>


                    <TextField
                        fullWidth
                        select
                        label="Vehicle"
                        value={selectedVehicleId}
                        onChange={(event) => {

                            setSelectedVehicleId(
                                event.target.value
                            );

                            setResult(null);

                            setError("");

                        }}
                        disabled={
                            loadingVehicles ||
                            predicting
                        }
                        sx={{
                            maxWidth: 650,

                            "& .MuiOutlinedInput-root": {
                                borderRadius: "12px",
                            },
                        }}
                    >

                        {loadingVehicles ? (

                            <MenuItem disabled>
                                Loading vehicles...
                            </MenuItem>

                        ) : vehicles.length === 0 ? (

                            <MenuItem disabled>
                                No vehicles found
                            </MenuItem>

                        ) : (

                            vehicles.map(
                                (vehicle) => (

                                    <MenuItem
                                        key={
                                            vehicle.id
                                        }
                                        value={
                                            vehicle.id
                                        }
                                    >

                                        {vehicle.vehicle_name}
                                        {" — "}
                                        {vehicle.registration_number}

                                    </MenuItem>

                                )
                            )

                        )}

                    </TextField>


                    {/* SELECTED VEHICLE INFORMATION */}

                    {selectedVehicle && (

                        <Box
                            sx={{
                                marginTop: 3,
                                padding: 2.5,
                                borderRadius: "15px",
                                background:
                                    "#f7faff",
                                border:
                                    "1px solid #e4edf8",
                            }}
                        >

                            <Stack
                                direction={{
                                    xs: "column",
                                    sm: "row",
                                }}
                                spacing={{
                                    xs: 1.5,
                                    sm: 4,
                                }}
                                flexWrap="wrap"
                            >

                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "#8996a8",
                                            fontWeight: 700,
                                        }}
                                    >
                                        VEHICLE
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color:
                                                "#172942",
                                        }}
                                    >
                                        {
                                            selectedVehicle.vehicle_name
                                        }
                                    </Typography>

                                </Box>


                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "#8996a8",
                                            fontWeight: 700,
                                        }}
                                    >
                                        MODEL
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color:
                                                "#172942",
                                        }}
                                    >
                                        {
                                            selectedVehicle.model
                                        }
                                    </Typography>

                                </Box>


                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "#8996a8",
                                            fontWeight: 700,
                                        }}
                                    >
                                        REGISTRATION
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color:
                                                "#172942",
                                        }}
                                    >
                                        {
                                            selectedVehicle.registration_number
                                        }
                                    </Typography>

                                </Box>


                                <Box>

                                    <Typography
                                        sx={{
                                            fontSize: 10,
                                            color:
                                                "#8996a8",
                                            fontWeight: 700,
                                        }}
                                    >
                                        MILEAGE
                                    </Typography>

                                    <Typography
                                        sx={{
                                            fontSize: 14,
                                            fontWeight: 700,
                                            color:
                                                "#172942",
                                        }}
                                    >
                                        {
                                            Number(
                                                selectedVehicle.mileage ||
                                                0
                                            ).toLocaleString()
                                        }{" "}
                                        km
                                    </Typography>

                                </Box>

                            </Stack>

                        </Box>

                    )}


                    {/* PREDICT BUTTON */}

                    <Box
                        sx={{
                            marginTop: 3,
                            display: "flex",
                            gap: 1.5,
                            flexWrap: "wrap",
                        }}
                    >

                        <Button
                            variant="contained"
                            startIcon={
                                predicting
                                    ? (
                                        <CircularProgress
                                            size={18}
                                            sx={{
                                                color:
                                                    "#ffffff",
                                            }}
                                        />
                                    )
                                    : <AutoAwesome />
                            }
                            onClick={
                                handlePrediction
                            }
                            disabled={
                                predicting ||
                                loadingVehicles ||
                                !selectedVehicleId
                            }
                            sx={{
                                minHeight: 50,
                                padding:
                                    "0 24px",
                                borderRadius:
                                    "11px",
                                background:
                                    "linear-gradient(135deg,#075fd0,#1595ff)",
                                textTransform:
                                    "none",
                                fontWeight:
                                    700,
                                boxShadow:
                                    "0 10px 25px rgba(7,95,208,0.22)",
                                "&:hover": {
                                    background:
                                        "linear-gradient(135deg,#064fae,#087bd8)",
                                },
                            }}
                        >

                            {predicting
                                ? "Analyzing..."
                                : "Run AI Prediction"}

                        </Button>


                        {/* HISTORY BUTTON */}

                        <Button
                            variant="outlined"
                            startIcon={
                                <History />
                            }
                            onClick={() =>
                                navigate(
                                    "/prediction-history"
                                )
                            }
                            sx={{
                                minHeight: 50,
                                padding:
                                    "0 22px",
                                borderRadius:
                                    "11px",
                                borderColor:
                                    "#075fd0",
                                color:
                                    "#075fd0",
                                textTransform:
                                    "none",
                                fontWeight:
                                    700,
                                "&:hover": {
                                    borderColor:
                                        "#064fae",
                                    background:
                                        "#edf5ff",
                                },
                            }}
                        >
                            Prediction History
                        </Button>


                        {/* REFRESH */}

                        <Button
                            variant="text"
                            startIcon={
                                <Refresh />
                            }
                            onClick={
                                fetchVehicles
                            }
                            disabled={
                                loadingVehicles ||
                                predicting
                            }
                            sx={{
                                minHeight: 50,
                                color:
                                    "#687991",
                                textTransform:
                                    "none",
                            }}
                        >
                            Refresh Vehicles
                        </Button>

                    </Box>

                </Paper>



                {/* =================================================
                    RESULT
                ================================================= */}

                {result && (

                    <Paper
                        elevation={0}
                        sx={{
                            padding: {
                                xs: 2.5,
                                md: 4,
                            },
                            borderRadius: "22px",
                            border:
                                "1px solid #e3eaf3",
                            background: "#ffffff",
                        }}
                    >

                        {/* RESULT HEADER */}

                        <Stack
                            direction="row"
                            spacing={1.5}
                            alignItems="center"
                            sx={{
                                marginBottom: 3,
                            }}
                        >

                            <Box
                                sx={{
                                    width: 45,
                                    height: 45,
                                    borderRadius:
                                        "13px",
                                    display:
                                        "flex",
                                    alignItems:
                                        "center",
                                    justifyContent:
                                        "center",
                                    background:
                                        "#eaf8f0",
                                    color:
                                        "#168653",
                                }}
                            >

                                <Psychology />

                            </Box>


                            <Box>

                                <Typography
                                    sx={{
                                        fontSize: 19,
                                        fontWeight: 800,
                                        color:
                                            "#10243f",
                                    }}
                                >
                                    AI Prediction Result
                                </Typography>

                                <Typography
                                    sx={{
                                        fontSize: 12,
                                        color:
                                            "#7b899d",
                                    }}
                                >
                                    AI-generated vehicle health analysis
                                </Typography>

                            </Box>

                        </Stack>


                        <Divider
                            sx={{
                                marginBottom: 3,
                            }}
                        />


                        {/* RESULT CARDS */}

                        <Box
                            sx={{
                                display: "grid",
                                gridTemplateColumns: {
                                    xs: "1fr",
                                    sm: "repeat(3, 1fr)",
                                },
                                gap: 2,
                            }}
                        >


                            {/* HEALTH SCORE */}

                            <Box
                                sx={{
                                    padding: 2.5,
                                    borderRadius: "16px",
                                    background:
                                        "#f7faff",
                                    border:
                                        "1px solid #e4edf8",
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >

                                    <Favorite
                                        sx={{
                                            color:
                                                getHealthColor(
                                                    result.health_score
                                                ),
                                        }}
                                    />

                                    <Box>

                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color:
                                                    "#8996a8",
                                                fontWeight: 700,
                                            }}
                                        >
                                            HEALTH SCORE
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 30,
                                                fontWeight: 800,
                                                color:
                                                    getHealthColor(
                                                        result.health_score
                                                    ),
                                            }}
                                        >
                                            {
                                                result.health_score
                                            }
                                            /100
                                        </Typography>

                                    </Box>

                                </Stack>


                                <Chip
                                    label={
                                        result.health_status ||
                                        getHealthStatus(
                                            result.health_score
                                        )
                                    }
                                    size="small"
                                    sx={{
                                        marginTop: 1.5,
                                        fontWeight: 700,
                                        color:
                                            getHealthColor(
                                                result.health_score
                                            ),
                                        backgroundColor:
                                            `${getHealthColor(
                                                result.health_score
                                            )}18`,
                                    }}
                                />

                            </Box>



                            {/* MAINTENANCE PROBABILITY */}

                            <Box
                                sx={{
                                    padding: 2.5,
                                    borderRadius: "16px",
                                    background:
                                        "#f7faff",
                                    border:
                                        "1px solid #e4edf8",
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >

                                    <Build
                                        sx={{
                                            color:
                                                "#075fd0",
                                        }}
                                    />

                                    <Box>

                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color:
                                                    "#8996a8",
                                                fontWeight: 700,
                                            }}
                                        >
                                            MAINTENANCE PROBABILITY
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 30,
                                                fontWeight: 800,
                                                color:
                                                    "#075fd0",
                                            }}
                                        >
                                            {
                                                result.maintenance_probability
                                            }
                                            %
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Box>



                            {/* PREDICTION */}

                            <Box
                                sx={{
                                    padding: 2.5,
                                    borderRadius: "16px",
                                    background:
                                        "#f7faff",
                                    border:
                                        "1px solid #e4edf8",
                                }}
                            >

                                <Stack
                                    direction="row"
                                    spacing={1.5}
                                    alignItems="center"
                                >

                                    <AutoAwesome
                                        sx={{
                                            color:
                                                result.prediction?.toLowerCase() ===
                                                "yes"
                                                    ? "#b42318"
                                                    : "#168653",
                                        }}
                                    />

                                    <Box>

                                        <Typography
                                            sx={{
                                                fontSize: 11,
                                                color:
                                                    "#8996a8",
                                                fontWeight: 700,
                                            }}
                                        >
                                            PREDICTION
                                        </Typography>

                                        <Typography
                                            sx={{
                                                fontSize: 22,
                                                fontWeight: 800,
                                                color:
                                                    result.prediction?.toLowerCase() ===
                                                    "yes"
                                                        ? "#b42318"
                                                        : "#168653",
                                            }}
                                        >
                                            {
                                                result.prediction ===
                                                "Yes"
                                                    ? "Maintenance Required"
                                                    : "No Maintenance"
                                            }
                                        </Typography>

                                    </Box>

                                </Stack>

                            </Box>

                        </Box>



                        {/* =================================================
                            RECOMMENDATION
                        ================================================= */}

                        <Box
                            sx={{
                                marginTop: 3,
                                padding: 3,
                                borderRadius: "17px",
                                background:
                                    "linear-gradient(135deg,#f1f7ff,#f8fbff)",
                                border:
                                    "1px solid #dce9f8",
                            }}
                        >

                            <Typography
                                sx={{
                                    color:
                                        "#10243f",
                                    fontSize: 15,
                                    fontWeight: 800,
                                    marginBottom:
                                        1,
                                }}
                            >
                                AI Recommendation
                            </Typography>


                            <Typography
                                sx={{
                                    color:
                                        "#66768b",
                                    fontSize: 13,
                                    lineHeight: 1.8,
                                }}
                            >
                                {
                                    result.recommendation
                                }
                            </Typography>

                        </Box>


                        {/* =================================================
                            HISTORY LINK
                        ================================================= */}

                        <Box
                            sx={{
                                marginTop: 3,
                                display: "flex",
                                justifyContent:
                                    "flex-end",
                            }}
                        >

                            <Button
                                variant="outlined"
                                startIcon={
                                    <History />
                                }
                                onClick={() =>
                                    navigate(
                                        "/prediction-history"
                                    )
                                }
                                sx={{
                                    borderColor:
                                        "#075fd0",
                                    color:
                                        "#075fd0",
                                    borderRadius:
                                        "10px",
                                    textTransform:
                                        "none",
                                    fontWeight:
                                        700,
                                }}
                            >
                                View All Prediction History
                            </Button>

                        </Box>

                    </Paper>

                )}

            </Box>

        </Box>
    );
};


export default AIPrediction;