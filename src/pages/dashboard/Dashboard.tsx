import React from "react";

import {
    Box,
    Typography,
    Button,
    Paper,
    Stack,
    IconButton,
    Avatar,
} from "@mui/material";

import {
    DirectionsCar,
    Build,
    Psychology,
    Favorite,
    ArrowForward,
    Refresh,
    AutoAwesome,
    Security,
    Speed,
    Analytics,
    ImageSearch,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./Dashboard.css";


const Dashboard: React.FC = () => {

    const navigate = useNavigate();


    return (
        <Box className="dashboard-page">

            {/* =====================================================
                NAVBAR
            ===================================================== */}

            <Box className="dashboard-navbar">

                {/* LOGO */}

                <Box
                    className="dashboard-logo"
                    onClick={() => navigate("/dashboard")}
                >

                    <Box className="dashboard-logo-icon">
                        <DirectionsCar />
                    </Box>

                    <Box>
                        <Typography className="dashboard-logo-title">
                            SOBY
                        </Typography>

                        <Typography className="dashboard-logo-subtitle">
                            ENGINEERS
                        </Typography>
                    </Box>

                </Box>


                {/* NAVIGATION */}

                <Box className="dashboard-navigation">

                    <Button
                        className="dashboard-nav-active"
                        onClick={() => navigate("/dashboard")}
                    >
                        Dashboard
                    </Button>

                    <Button
                        className="dashboard-nav-button"
                        onClick={() => navigate("/vehicles")}
                    >
                        Vehicles
                    </Button>

                    <Button
                        className="dashboard-nav-button"
                        onClick={() => navigate("/maintenance")}
                    >
                        Maintenance
                    </Button>

                    <Button
    className="dashboard-nav-button"
    onClick={() => navigate("/ai-prediction")}
>
    AI Prediction
</Button>

<Button
    className="dashboard-nav-button"
    onClick={() => navigate("/image-ai")}
>
    AI Image Analysis
</Button>

<Button
    className="dashboard-nav-button"
    onClick={() => navigate("/reports")}
>
    Reports
</Button>
                </Box>


                {/* RIGHT SIDE */}

                <Box className="dashboard-navbar-right">

                    <IconButton
                        className="dashboard-refresh"
                        onClick={() => window.location.reload()}
                    >
                        <Refresh />
                    </IconButton>

                    <Avatar className="dashboard-avatar">
                        V
                    </Avatar>

                    <Box className="dashboard-user-info">

                        <Typography className="dashboard-user-name">
                            Vehicle Owner
                        </Typography>

                        <Typography className="dashboard-user-role">
                            Vehicle Owner
                        </Typography>

                    </Box>

                </Box>

            </Box>



            {/* =====================================================
                MAIN
            ===================================================== */}

            <Box className="dashboard-main">


                {/* =================================================
                    HERO WITH VIDEO BACKGROUND
                ================================================= */}

                <Box className="dashboard-hero">

                    {/* VIDEO */}

                    <video
                        className="dashboard-bg-video"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="auto"
                    >
                        <source
                            src="/dashboard-bg.mp4"
                            type="video/mp4"
                        />
                    </video>


                    {/* VIDEO OVERLAY */}

                    <Box className="dashboard-video-overlay" />


                    {/* DECORATIVE GLOW */}

                    <Box className="hero-glow hero-glow-one" />
                    <Box className="hero-glow hero-glow-two" />


                    {/* HERO CONTENT */}

                    <Box className="dashboard-hero-content">


                        {/* LEFT */}

                        <Box className="dashboard-hero-left">

                            <Box className="dashboard-ai-badge">

                                <Box className="dashboard-status-dot" />

                                <Typography>
                                    AI VEHICLE INTELLIGENCE
                                </Typography>

                            </Box>


                            <Typography className="dashboard-greeting">
                                Good evening, Vehicle Owner
                            </Typography>


                            <Typography className="dashboard-hero-title">

                                Smarter vehicles.
                                <br />

                                <span>
                                    Predictive
                                </span>

                                <br />

                                <span>
                                    intelligence.
                                </span>

                            </Typography>


                            <Typography className="dashboard-hero-description">

                                Monitor your vehicles, understand their
                                health, and anticipate maintenance needs
                                before they become unexpected problems.

                            </Typography>


                            <Stack
                                direction="row"
                                spacing={2}
                                className="dashboard-hero-buttons"
                            >

                                <Button
                                    variant="contained"
                                    endIcon={<ArrowForward />}
                                    className="dashboard-primary-button"
                                    onClick={() =>
                                        navigate("/vehicles/add")
                                    }
                                >
                                    Add Vehicle
                                </Button>


                                <Button
                                    variant="outlined"
                                    startIcon={<Psychology />}
                                    className="dashboard-secondary-button"
                                    onClick={() =>
                                        navigate("/ai-prediction")
                                    }
                                >
                                    Run AI Prediction
                                </Button>

                            </Stack>

                        </Box>



                        {/* RIGHT SIDE */}

                        <Box className="dashboard-hero-right">


                            {/* AI STATUS */}

                            <Paper
                                elevation={0}
                                className="dashboard-status-card"
                            >

                                <Box className="status-card-icon">
                                    <AutoAwesome />
                                </Box>

                                <Box>

                                    <Typography className="status-card-label">
                                        AI STATUS
                                    </Typography>

                                    <Typography className="status-card-value">
                                        Analysis Active
                                    </Typography>

                                </Box>

                            </Paper>


                            {/* VEHICLE HEALTH */}

                            <Paper
                                elevation={0}
                                className="dashboard-health-card"
                            >

                                <Box className="health-card-icon">
                                    <Favorite />
                                </Box>

                                <Box>

                                    <Typography className="health-card-label">
                                        VEHICLE HEALTH
                                    </Typography>

                                    <Typography className="health-card-value">
                                        Monitoring Active
                                    </Typography>

                                </Box>

                            </Paper>

                        </Box>

                    </Box>

                </Box>



                {/* =================================================
                    QUICK ACCESS
                ================================================= */}

                <Box className="dashboard-section">

                    <Box className="dashboard-section-heading">

                        <Box>

                            <Typography className="dashboard-section-title">
                                Vehicle Intelligence
                            </Typography>

                            <Typography className="dashboard-section-subtitle">
                                Everything you need to manage and monitor your vehicles
                            </Typography>

                        </Box>

                    </Box>


                    <Box className="dashboard-feature-grid">


                        {/* VEHICLES */}

                        <Paper
                            elevation={0}
                            className="dashboard-feature-card"
                            onClick={() => navigate("/vehicles")}
                        >

                            <Box className="feature-icon">
                                <DirectionsCar />
                            </Box>

                            <Typography className="feature-title">
                                My Vehicles
                            </Typography>

                            <Typography className="feature-description">
                                View, add and manage all your registered vehicles.
                            </Typography>

                            <Box className="feature-link">
                                Manage Vehicles
                                <ArrowForward />
                            </Box>

                        </Paper>



                        {/* MAINTENANCE */}

                        <Paper
                            elevation={0}
                            className="dashboard-feature-card"
                            onClick={() => navigate("/maintenance")}
                        >

                            <Box className="feature-icon">
                                <Build />
                            </Box>

                            <Typography className="feature-title">
                                Maintenance
                            </Typography>

                            <Typography className="feature-description">
                                Track service records and maintenance activities.
                            </Typography>

                            <Box className="feature-link">
                                View Maintenance
                                <ArrowForward />
                            </Box>

                        </Paper>



                        {/* AI */}

                        <Paper
                            elevation={0}
                            className="dashboard-feature-card"
                            onClick={() => navigate("/ai-prediction")}
                        >

                            <Box className="feature-icon">
                                <Psychology />
                            </Box>

                            <Typography className="feature-title">
                                AI Prediction
                            </Typography>

                            <Typography className="feature-description">
                                Analyze vehicle health and predict maintenance requirements.
                            </Typography>

                            <Box className="feature-link">
                                Run Prediction
                                <ArrowForward />
                            </Box>

                        </Paper>
                        {/* AI IMAGE ANALYSIS */}

<Paper
    elevation={0}
    className="dashboard-feature-card"
    onClick={() => navigate("/image-ai")}
>

    <Box className="feature-icon">
        <ImageSearch />
    </Box>

    <Typography className="feature-title">
        AI Image Analysis
    </Typography>

    <Typography className="feature-description">
        Upload a vehicle image and analyze its visible condition using AI.
    </Typography>

    <Box className="feature-link">
        Analyze Image
        <ArrowForward />
    </Box>

</Paper>

                    </Box>

                </Box>



                {/* =================================================
                    SMART MONITORING
                ================================================= */}

                <Box className="dashboard-section">

                    <Box className="dashboard-section-heading">

                        <Box>

                            <Typography className="dashboard-section-title">
                                Smart Vehicle Monitoring
                            </Typography>

                            <Typography className="dashboard-section-subtitle">
                                Intelligent tools powered by vehicle data and AI
                            </Typography>

                        </Box>

                    </Box>


                    <Box className="dashboard-capabilities-grid">


                        <Paper
                            elevation={0}
                            className="capability-card"
                        >

                            <Box className="capability-icon">
                                <Analytics />
                            </Box>

                            <Typography className="capability-title">
                                AI Analysis
                            </Typography>

                            <Typography className="capability-text">
                                Analyze historical and operational vehicle
                                data to understand current vehicle condition.
                            </Typography>

                        </Paper>



                        <Paper
                            elevation={0}
                            className="capability-card"
                        >

                            <Box className="capability-icon">
                                <Speed />
                            </Box>

                            <Typography className="capability-title">
                                Predictive Maintenance
                            </Typography>

                            <Typography className="capability-text">
                                Predict potential maintenance requirements
                                before unexpected vehicle problems occur.
                            </Typography>

                        </Paper>



                        <Paper
                            elevation={0}
                            className="capability-card"
                        >

                            <Box className="capability-icon">
                                <Security />
                            </Box>

                            <Typography className="capability-title">
                                Vehicle Safety
                            </Typography>

                            <Typography className="capability-text">
                                Monitor vehicle health and receive timely
                                maintenance recommendations.
                            </Typography>

                        </Paper>

                    </Box>

                </Box>



                {/* =================================================
                    CTA
                ================================================= */}

                <Box className="dashboard-cta">

                    <Box>

                        <Typography className="cta-title">
                            Ready to check your vehicle?
                        </Typography>

                        <Typography className="cta-description">
                            Run an AI analysis and understand your vehicle's
                            current health condition.
                        </Typography>

                    </Box>


                    <Button
                        variant="contained"
                        endIcon={<ArrowForward />}
                        className="cta-button"
                        onClick={() =>
                            navigate("/ai-prediction")
                        }
                    >
                        Run AI Prediction
                    </Button>

                </Box>



                {/* =================================================
                    FOOTER
                ================================================= */}

                <Box className="dashboard-footer">

                    <Typography>
                        © 2026 Soby Engineers
                    </Typography>

                    <Typography>
                        AI-Driven Smart Vehicle Intelligence and Predictive Maintenance Platform
                    </Typography>

                </Box>

            </Box>

        </Box>
    );
};


export default Dashboard;