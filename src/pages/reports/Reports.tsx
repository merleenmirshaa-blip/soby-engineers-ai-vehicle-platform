import React from "react";
import {
    Box,
    Button,
    Paper,
    Typography,
} from "@mui/material";

import {
    DirectionsCar,
    Build,
    Favorite,
    Psychology,
    AssignmentTurnedIn,
    ArrowForward,
    ArrowBack,
    Assessment,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./Reports.css";

interface ReportItem {
    title: string;
    description: string;
    icon: React.ReactNode;
    path: string;
    label: string;
}

const Reports: React.FC = () => {

    const navigate = useNavigate();

    const reports: ReportItem[] = [

        {
            title: "Vehicle Details",
            description:
                "View complete vehicle information, specifications, mileage and operational details.",
            icon: <DirectionsCar />,
            path: "/reports/vehicle-details",
            label: "Vehicle Profile",
        },

        {
            title: "Maintenance History",
            description:
                "Track servicing activities, maintenance costs and service timelines.",
            icon: <Build />,
            path: "/reports/maintenance-history",
            label: "Service Timeline",
        },

        {
            title: "Vehicle Health",
            description:
                "Understand vehicle condition through health scores, indicators and recommendations.",
            icon: <Favorite />,
            path: "/reports/vehicle-health",
            label: "Health Analysis",
        },

        {
            title: "AI Prediction",
            description:
                "Explore AI-generated maintenance predictions, confidence and vehicle health analysis.",
            icon: <Psychology />,
            path: "/reports/ai-prediction",
            label: "AI Analysis",
        },

        {
            title: "Maintenance Requirement",
            description:
                "Identify upcoming maintenance requirements and recommended service actions.",
            icon: <AssignmentTurnedIn />,
            path: "/reports/maintenance-requirement",
            label: "Action Plan",
        },

    ];

    return (

        <Box className="reports-page">

            {/* ================= HEADER ================= */}

            <Box className="reports-topbar">

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/dashboard")}
                    className="reports-back-button"
                >
                    Dashboard
                </Button>

                <Box className="reports-header-icon">
                    <Assessment />
                </Box>

            </Box>


            {/* ================= HERO ================= */}

            <Box className="reports-hero">

                <Box className="reports-hero-content">

                    <Typography className="reports-eyebrow">
                        VEHICLE INTELLIGENCE
                    </Typography>

                    <Typography className="reports-title">
                        Reports & Analytics
                    </Typography>

                    <Typography className="reports-description">
                        Transform your vehicle data into meaningful insights,
                        maintenance intelligence and AI-powered analysis.
                    </Typography>

                </Box>

                <Box className="reports-hero-visual">

                    <div className="hero-circle hero-circle-one" />
                    <div className="hero-circle hero-circle-two" />

                    <Assessment className="hero-report-icon" />

                </Box>

            </Box>


            {/* ================= REPORT NAVIGATION ================= */}

            <Box className="reports-section-header">

                <Box>

                    <Typography className="reports-section-title">
                        Intelligence Reports
                    </Typography>

                    <Typography className="reports-section-subtitle">
                        Select a report to explore detailed vehicle insights.
                    </Typography>

                </Box>

                <Typography className="reports-count">
                    05 REPORTS
                </Typography>

            </Box>


            {/* ================= REPORT CARDS ================= */}

            <Box className="reports-grid">

                {reports.map((report, index) => (

                    <Paper
                        key={report.title}
                        className={`report-modern-card report-card-${index + 1}`}
                        elevation={0}
                        onClick={() => navigate(report.path)}
                    >

                        <Box className="report-card-top">

                            <Box className="report-icon-wrapper">
                                {report.icon}
                            </Box>

                            <Typography className="report-number">
                                0{index + 1}
                            </Typography>

                        </Box>


                        <Box className="report-card-content">

                            <Typography className="report-card-label">
                                {report.label}
                            </Typography>

                            <Typography className="report-card-title">
                                {report.title}
                            </Typography>

                            <Typography className="report-card-description">
                                {report.description}
                            </Typography>

                        </Box>


                        <Box className="report-card-footer">

                            <Typography className="open-report">
                                Explore Report
                            </Typography>

                            <Box className="report-arrow">
                                <ArrowForward />
                            </Box>

                        </Box>

                    </Paper>

                ))}

            </Box>


            {/* ================= FOOTER INFO ================= */}

            <Box className="reports-footer">

                <Box>

                    <Typography className="reports-footer-title">
                        AI-Driven Vehicle Intelligence
                    </Typography>

                    <Typography className="reports-footer-text">
                        Analyze historical and operational vehicle data
                        to support smarter maintenance decisions.
                    </Typography>

                </Box>

                <Box className="reports-footer-badge">
                    <Psychology />
                    <span>AI POWERED</span>
                </Box>

            </Box>

        </Box>
    );
};

export default Reports;