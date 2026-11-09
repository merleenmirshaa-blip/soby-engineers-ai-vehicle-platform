import React, { useEffect, useState } from "react";
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    MenuItem,
    Select,
} from "@mui/material";

import {
    ArrowBack,
    DirectionsCar,
    Speed,
    CalendarMonth,
    LocalGasStation,
    Engineering,
    Timeline,
    ArrowForward,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./VehicleDetailsReport.css";

interface Vehicle {
    id: number;
    vehicle_name: string;
    model: string;
    registration_number: string;
    manufacturer: string;
    fuel_type: string;
    purchase_date?: string;
    mileage: number;
    engine_type?: string;
    vehicle_usage?: string;
}

const VehicleDetailsReport: React.FC = () => {

    const navigate = useNavigate();

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [selectedVehicleId, setSelectedVehicleId] =
        useState<number | "">("");

    const [showReport, setShowReport] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchVehicles = async () => {

            try {

                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/vehicles",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (Array.isArray(data)) {
                    setVehicles(data);
                } else if (data.vehicles) {
                    setVehicles(data.vehicles);
                }

            } catch (error) {

                console.error(
                    "Vehicle report error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        };

        fetchVehicles();

    }, []);

    const selectedVehicle = vehicles.find(
        vehicle => vehicle.id === selectedVehicleId
    );

    const getVehicleAge = (date?: string) => {

        if (!date) return "N/A";

        const purchaseDate = new Date(date);
        const today = new Date();

        let age =
            today.getFullYear() -
            purchaseDate.getFullYear();

        const monthDifference =
            today.getMonth() -
            purchaseDate.getMonth();

        if (
            monthDifference < 0 ||
            (
                monthDifference === 0 &&
                today.getDate() < purchaseDate.getDate()
            )
        ) {
            age--;
        }

        return `${Math.max(age, 0)} Years`;
    };

    const getMileagePercentage = (mileage: number) => {

        return Math.min(
            (mileage / 200000) * 100,
            100
        );
    };

    return (

        <Box className="modern-vehicle-report">

            {/* TOP NAVIGATION */}

            <Box className="modern-report-nav">

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/reports")}
                    className="modern-back-button"
                >
                    Reports
                </Button>

                <Typography className="modern-nav-label">
                    SOBY ENGINEERS
                </Typography>

            </Box>


            {/* HERO */}

            <Box className="vehicle-report-hero">

                <Box className="vehicle-hero-content">

                    <Typography className="vehicle-hero-overline">
                        VEHICLE INTELLIGENCE
                    </Typography>

                    <Typography className="vehicle-hero-title">
                        Vehicle Details
                    </Typography>

                    <Typography className="vehicle-hero-text">
                        Select a vehicle to generate a complete
                        intelligence profile using its historical
                        and operational information.
                    </Typography>

                </Box>

                <Box className="vehicle-hero-decoration">

                    <DirectionsCar />

                    <div className="hero-ring ring-one" />
                    <div className="hero-ring ring-two" />

                </Box>

            </Box>


            {/* VEHICLE SELECTOR */}

            <Box className="vehicle-selection-area">

                <Box className="selection-heading">

                    <Box className="selection-icon">
                        <DirectionsCar />
                    </Box>

                    <Box>

                        <Typography className="selection-title">
                            Choose your vehicle
                        </Typography>

                        <Typography className="selection-subtitle">
                            Select one vehicle to view its detailed report
                        </Typography>

                    </Box>

                </Box>


                <Box className="vehicle-selector">

                    <Box className="selector-left">

                        <Typography className="selector-label">
                            SELECT VEHICLE
                        </Typography>

                        <Select
                            value={selectedVehicleId}
                            displayEmpty
                            fullWidth
                            variant="standard"
                            disableUnderline
                            onChange={(event) => {

                                setSelectedVehicleId(
                                    event.target.value as number
                                );

                                setShowReport(false);

                            }}
                            className="modern-select"
                        >

                            <MenuItem value="">
                                Choose a vehicle...
                            </MenuItem>

                            {vehicles.map(vehicle => (

                                <MenuItem
                                    key={vehicle.id}
                                    value={vehicle.id}
                                >

                                    <Box className="vehicle-option">

                                        <Box className="vehicle-option-icon">
                                            <DirectionsCar />
                                        </Box>

                                        <Box>

                                            <Typography>
                                                {vehicle.vehicle_name}
                                            </Typography>

                                            <span>
                                                {vehicle.manufacturer}{" "}
                                                {vehicle.model}
                                                {" • "}
                                                {vehicle.registration_number}
                                            </span>

                                        </Box>

                                    </Box>

                                </MenuItem>

                            ))}

                        </Select>

                    </Box>


                    <Button
                        disabled={!selectedVehicleId}
                        onClick={() => setShowReport(true)}
                        className="generate-report-button"
                        endIcon={<ArrowForward />}
                    >
                        Generate Report
                    </Button>

                </Box>

            </Box>


            {/* LOADING */}

            {loading && (

                <Box className="modern-report-loading">

                    <CircularProgress />

                    <Typography>
                        Loading vehicles...
                    </Typography>

                </Box>

            )}


            {/* EMPTY STATE */}

            {!loading &&
                !showReport && (

                    <Box className="modern-report-empty">

                        <Box className="empty-illustration">
                            <DirectionsCar />
                        </Box>

                        <Typography className="empty-title">
                            Your vehicle report starts here
                        </Typography>

                        <Typography className="empty-text">
                            Select a vehicle above and generate its
                            intelligence report.
                        </Typography>

                    </Box>

                )}


            {/* REPORT */}

            {!loading &&
                showReport &&
                selectedVehicle && (

                    <Box className="generated-vehicle-report">

                        {/* PROFILE HEADER */}

                        <Box className="generated-profile">

                            <Box className="generated-profile-left">

                                <Box className="large-car-icon">
                                    <DirectionsCar />
                                </Box>

                                <Box>

                                    <Typography className="profile-overline">
                                        VEHICLE PROFILE
                                    </Typography>

                                    <Typography className="profile-name">
                                        {selectedVehicle.vehicle_name}
                                    </Typography>

                                    <Typography className="profile-model">
                                        {selectedVehicle.manufacturer}{" "}
                                        {selectedVehicle.model}
                                        {" • "}
                                        {selectedVehicle.registration_number}
                                    </Typography>

                                </Box>

                            </Box>

                            <Box className="profile-status">
                                ACTIVE VEHICLE
                            </Box>

                        </Box>


                        {/* STATS */}

                        <Box className="vehicle-stat-row">

                            <Box className="modern-stat">

                                <Box className="stat-icon">
                                    <Speed />
                                </Box>

                                <Box>

                                    <span>
                                        MILEAGE
                                    </span>

                                    <strong>
                                        {Number(
                                            selectedVehicle.mileage || 0
                                        ).toLocaleString("en-IN")}
                                        <small> km</small>
                                    </strong>

                                </Box>

                            </Box>


                            <Box className="modern-stat">

                                <Box className="stat-icon">
                                    <CalendarMonth />
                                </Box>

                                <Box>

                                    <span>
                                        VEHICLE AGE
                                    </span>

                                    <strong>
                                        {getVehicleAge(
                                            selectedVehicle.purchase_date
                                        )}
                                    </strong>

                                </Box>

                            </Box>


                            <Box className="modern-stat">

                                <Box className="stat-icon">
                                    <LocalGasStation />
                                </Box>

                                <Box>

                                    <span>
                                        FUEL
                                    </span>

                                    <strong>
                                        {selectedVehicle.fuel_type || "N/A"}
                                    </strong>

                                </Box>

                            </Box>


                            <Box className="modern-stat">

                                <Box className="stat-icon">
                                    <Engineering />
                                </Box>

                                <Box>

                                    <span>
                                        USAGE
                                    </span>

                                    <strong>
                                        {selectedVehicle.vehicle_usage || "N/A"}
                                    </strong>

                                </Box>

                            </Box>

                        </Box>


                        {/* LOWER CONTENT */}

                        <Box className="report-content-grid">

                            {/* SPECIFICATIONS */}

                            <Box className="modern-report-panel">

                                <Box className="panel-heading">

                                    <SettingsIcon />

                                    <Box>

                                        <Typography>
                                            Vehicle Specifications
                                        </Typography>

                                        <span>
                                            Registered vehicle information
                                        </span>

                                    </Box>

                                </Box>


                                <Box className="spec-grid">

                                    <Box>
                                        <span>Manufacturer</span>
                                        <strong>
                                            {selectedVehicle.manufacturer || "N/A"}
                                        </strong>
                                    </Box>

                                    <Box>
                                        <span>Model</span>
                                        <strong>
                                            {selectedVehicle.model || "N/A"}
                                        </strong>
                                    </Box>

                                    <Box>
                                        <span>Registration</span>
                                        <strong>
                                            {selectedVehicle.registration_number || "N/A"}
                                        </strong>
                                    </Box>

                                    <Box>
                                        <span>Engine Type</span>
                                        <strong>
                                            {selectedVehicle.engine_type || "N/A"}
                                        </strong>
                                    </Box>

                                </Box>

                            </Box>


                            {/* MILEAGE */}

                            <Box className="modern-report-panel mileage-panel">

                                <Box className="panel-heading">

                                    <Timeline />

                                    <Box>

                                        <Typography>
                                            Mileage Overview
                                        </Typography>

                                        <span>
                                            Operational usage indicator
                                        </span>

                                    </Box>

                                </Box>


                                <Box className="mileage-main">

                                    <strong>
                                        {Number(
                                            selectedVehicle.mileage || 0
                                        ).toLocaleString("en-IN")}
                                    </strong>

                                    <span>
                                        KM
                                    </span>

                                </Box>


                                <Box className="modern-mileage-bar">

                                    <Box
                                        style={{
                                            width:
                                                `${getMileagePercentage(
                                                    Number(
                                                        selectedVehicle.mileage || 0
                                                    )
                                                )}%`
                                        }}
                                    />

                                </Box>


                                <Box className="mileage-labels">

                                    <span>0 KM</span>
                                    <span>100K</span>
                                    <span>200K+</span>

                                </Box>

                            </Box>

                        </Box>

                    </Box>

                )}

        </Box>
    );
};


/* Small icon component */

const SettingsIcon = () => (
    <Engineering />
);

export default VehicleDetailsReport;