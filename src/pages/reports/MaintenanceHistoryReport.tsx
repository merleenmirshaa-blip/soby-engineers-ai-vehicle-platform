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
    ArrowForward,
    Build,
    CalendarMonth,
    DirectionsCar,
    Engineering,
    Payments,
    Timeline,
    CheckCircle,
    AccessTime,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import "./MaintenanceHistoryReport.css";


interface Vehicle {
    id: number;
    vehicle_name: string;
    model: string;
    registration_number: string;
    manufacturer?: string;
    fuel_type?: string;
}


interface Maintenance {
    id: number;
    vehicle_id: number;

    service_date?: string;
    maintenance_date?: string;

    service_type?: string;
    maintenance_type?: string;

    description?: string;

    cost?: number;
    amount?: number;
    service_cost?: number;

    status?: string;

    created_at?: string;
}


const MaintenanceHistoryReport: React.FC = () => {

    const navigate = useNavigate();


    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [maintenanceRecords, setMaintenanceRecords] =
        useState<Maintenance[]>([]);

    const [selectedVehicleId, setSelectedVehicleId] =
        useState<number | "">("");

    const [showReport, setShowReport] =
        useState(false);

    const [loading, setLoading] =
        useState(true);

    const [maintenanceLoading, setMaintenanceLoading] =
        useState(false);


    /* =========================================
       FETCH VEHICLES
    ========================================= */

    useEffect(() => {

        const fetchVehicles = async () => {

            try {

                const token =
                    localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/vehicles",
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await response.json();

                console.log(
                    "Maintenance Report Vehicles:",
                    data
                );

                if (Array.isArray(data)) {

                    setVehicles(data);

                } else if (data.vehicles) {

                    setVehicles(data.vehicles);

                }

            } catch (error) {

                console.error(
                    "Vehicle fetch error:",
                    error
                );

            } finally {

                setLoading(false);

            }

        };

        fetchVehicles();

    }, []);


    /* =========================================
       FETCH MAINTENANCE
    ========================================= */

    const fetchMaintenance = async (
        vehicleId: number
    ) => {

        try {

            setMaintenanceLoading(true);

            const token =
                localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/maintenance",
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`,
                    },
                }
            );

            const data =
                await response.json();

            console.log(
                "Maintenance Report Data:",
                data
            );


            let records: Maintenance[] = [];


            if (Array.isArray(data)) {

                records = data;

            } else if (Array.isArray(data.maintenance)) {

                records = data.maintenance;

            } else if (Array.isArray(data.records)) {

                records = data.records;

            }


            const vehicleRecords =
                records.filter(
                    record =>
                        Number(record.vehicle_id) ===
                        Number(vehicleId)
                );


            setMaintenanceRecords(
                vehicleRecords
            );

        } catch (error) {

            console.error(
                "Maintenance fetch error:",
                error
            );

            setMaintenanceRecords([]);

        } finally {

            setMaintenanceLoading(false);

        }

    };


    /* =========================================
       SELECTED VEHICLE
    ========================================= */

    const selectedVehicle =
        vehicles.find(
            vehicle =>
                vehicle.id ===
                selectedVehicleId
        );


    /* =========================================
       HELPERS
    ========================================= */

    const getDate = (
        record: Maintenance
    ) => {

        return (
            record.service_date ||
            record.maintenance_date ||
            record.created_at ||
            ""
        );

    };


    const getServiceName = (
        record: Maintenance
    ) => {

        return (
            record.service_type ||
            record.maintenance_type ||
            "General Maintenance"
        );

    };


    const getCost = (
        record: Maintenance
    ) => {

        return Number(
            record.cost ??
            record.amount ??
            record.service_cost ??
            0
        );

    };


    const formatDate = (
        date?: string
    ) => {

        if (!date) return "Date unavailable";

        const parsedDate =
            new Date(date);

        if (Number.isNaN(
            parsedDate.getTime()
        )) {
            return date;
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );

    };


    const formatCurrency = (
        amount: number
    ) => {

        return `₹${amount.toLocaleString(
            "en-IN"
        )}`;

    };


    /* =========================================
       SORT RECORDS
    ========================================= */

    const sortedRecords =
        useMemo(() => {

            return [...maintenanceRecords]
                .sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                getDate(a)
                            ).getTime();

                        const dateB =
                            new Date(
                                getDate(b)
                            ).getTime();

                        return dateB - dateA;

                    }
                );

        }, [maintenanceRecords]);


    /* =========================================
       SUMMARY
    ========================================= */

    const totalServices =
        maintenanceRecords.length;


    const totalCost =
        maintenanceRecords.reduce(
            (sum, record) =>
                sum + getCost(record),
            0
        );


    const latestService =
        sortedRecords.length > 0
            ? sortedRecords[0]
            : undefined;


    const averageCost =
        totalServices > 0
            ? totalCost / totalServices
            : 0;


    const maxCost =
        Math.max(
            ...maintenanceRecords.map(
                record =>
                    getCost(record)
            ),
            1
        );


    /* =========================================
       GENERATE REPORT
    ========================================= */

    const handleGenerateReport = async () => {

        if (!selectedVehicleId) {
            return;
        }

        await fetchMaintenance(
            Number(selectedVehicleId)
        );

        setShowReport(true);

    };


    return (

        <Box className="maintenance-report-page">


            {/* =====================================
                TOP NAVIGATION
            ===================================== */}

            <Box className="maintenance-report-nav">

                <Button
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate("/reports")
                    }
                    className="maintenance-back-button"
                >
                    Reports
                </Button>


                <Typography className="maintenance-brand">
                    SOBY ENGINEERS
                </Typography>

            </Box>


            {/* =====================================
                HERO
            ===================================== */}

            <Box className="maintenance-report-hero">

                <Box className="maintenance-hero-content">

                    <Typography className="maintenance-overline">
                        VEHICLE INTELLIGENCE
                    </Typography>


                    <Typography className="maintenance-hero-title">
                        Maintenance History
                    </Typography>


                    <Typography className="maintenance-hero-description">

                        Explore the complete maintenance
                        journey of your vehicle through
                        service activity, timelines and
                        maintenance insights.

                    </Typography>

                </Box>


                <Box className="maintenance-hero-visual">

                    <Build />

                    <Box className="maintenance-hero-ring ring-one" />
                    <Box className="maintenance-hero-ring ring-two" />

                </Box>

            </Box>


            {/* =====================================
                VEHICLE SELECTOR
            ===================================== */}

            <Box className="maintenance-selector">

                <Box className="maintenance-selector-heading">

                    <Box className="maintenance-selector-icon">
                        <DirectionsCar />
                    </Box>


                    <Box>

                        <Typography className="maintenance-selector-title">
                            Choose your vehicle
                        </Typography>

                        <Typography className="maintenance-selector-subtitle">
                            Select one vehicle to generate its maintenance report
                        </Typography>

                    </Box>

                </Box>


                <Box className="maintenance-selector-row">

                    <Box className="maintenance-select-wrapper">

                        <Typography className="maintenance-select-label">
                            SELECT VEHICLE
                        </Typography>


                        <Select
                            value={selectedVehicleId}
                            displayEmpty
                            fullWidth
                            variant="standard"
                            disableUnderline
                            className="maintenance-select"
                            onChange={(event) => {

                                setSelectedVehicleId(
                                    event.target.value as number
                                );

                                setShowReport(false);

                                setMaintenanceRecords([]);

                            }}
                        >

                            <MenuItem value="">
                                Choose a vehicle...
                            </MenuItem>


                            {vehicles.map(
                                vehicle => (

                                    <MenuItem
                                        key={vehicle.id}
                                        value={vehicle.id}
                                    >

                                        <Box className="maintenance-vehicle-option">

                                            <Box className="maintenance-option-icon">
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

                                )
                            )}

                        </Select>

                    </Box>


                    <Button
                        disabled={
                            !selectedVehicleId ||
                            maintenanceLoading
                        }
                        onClick={
                            handleGenerateReport
                        }
                        className="maintenance-generate-button"
                        endIcon={
                            maintenanceLoading
                                ? undefined
                                : <ArrowForward />
                        }
                    >

                        {maintenanceLoading
                            ? "Generating..."
                            : "Generate Report"}

                    </Button>

                </Box>

            </Box>


            {/* =====================================
                INITIAL LOADING
            ===================================== */}

            {loading && (

                <Box className="maintenance-loading">

                    <CircularProgress />

                    <Typography>
                        Loading vehicles...
                    </Typography>

                </Box>

            )}


            {/* =====================================
                EMPTY STATE
            ===================================== */}

            {!loading &&
                !showReport && (

                    <Box className="maintenance-empty">

                        <Box className="maintenance-empty-icon">
                            <Timeline />
                        </Box>


                        <Typography className="maintenance-empty-title">
                            Your maintenance report starts here
                        </Typography>


                        <Typography className="maintenance-empty-text">
                            Select a vehicle above to explore
                            its complete service history.
                        </Typography>

                    </Box>

                )}


            {/* =====================================
                GENERATED REPORT
            ===================================== */}

            {!loading &&
                showReport &&
                selectedVehicle && (

                    <Box className="maintenance-generated-report">


                        {/* =================================
                            VEHICLE PROFILE
                        ================================= */}

                        <Box className="maintenance-profile">

                            <Box className="maintenance-profile-left">

                                <Box className="maintenance-profile-icon">
                                    <DirectionsCar />
                                </Box>


                                <Box>

                                    <Typography className="maintenance-profile-overline">
                                        MAINTENANCE PROFILE
                                    </Typography>


                                    <Typography className="maintenance-profile-name">
                                        {selectedVehicle.vehicle_name}
                                    </Typography>


                                    <Typography className="maintenance-profile-model">

                                        {selectedVehicle.manufacturer}{" "}
                                        {selectedVehicle.model}
                                        {" • "}
                                        {selectedVehicle.registration_number}

                                    </Typography>

                                </Box>

                            </Box>


                            <Box className="maintenance-profile-status">

                                <CheckCircle />

                                HISTORY AVAILABLE

                            </Box>

                        </Box>


                        {/* =================================
                            SUMMARY STATISTICS
                        ================================= */}

                        <Box className="maintenance-stat-grid">


                            <Box className="maintenance-stat">

                                <Box className="maintenance-stat-icon">
                                    <Build />
                                </Box>

                                <Box>

                                    <span>
                                        TOTAL SERVICES
                                    </span>

                                    <strong>
                                        {totalServices}
                                    </strong>

                                </Box>

                            </Box>


                            <Box className="maintenance-stat">

                                <Box className="maintenance-stat-icon">
                                    <Payments />
                                </Box>

                                <Box>

                                    <span>
                                        TOTAL COST
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            totalCost
                                        )}
                                    </strong>

                                </Box>

                            </Box>


                            <Box className="maintenance-stat">

                                <Box className="maintenance-stat-icon">
                                    <CalendarMonth />
                                </Box>

                                <Box>

                                    <span>
                                        LATEST SERVICE
                                    </span>

                                    <strong>
                                        {latestService
                                            ? formatDate(
                                                getDate(
                                                    latestService
                                                )
                                            )
                                            : "No records"}
                                    </strong>

                                </Box>

                            </Box>


                            <Box className="maintenance-stat">

                                <Box className="maintenance-stat-icon">
                                    <Engineering />
                                </Box>

                                <Box>

                                    <span>
                                        AVERAGE COST
                                    </span>

                                    <strong>
                                        {formatCurrency(
                                            Math.round(
                                                averageCost
                                            )
                                        )}
                                    </strong>

                                </Box>

                            </Box>

                        </Box>


                        {/* =================================
                            MAIN REPORT CONTENT
                        ================================= */}

                        <Box className="maintenance-main-grid">


                            {/* =================================
                                TIMELINE
                            ================================= */}

                            <Box className="maintenance-panel timeline-panel">

                                <Box className="maintenance-panel-heading">

                                    <Box className="maintenance-panel-icon">
                                        <Timeline />
                                    </Box>


                                    <Box>

                                        <Typography>
                                            Service Timeline
                                        </Typography>

                                        <span>
                                            Maintenance activity over time
                                        </span>

                                    </Box>

                                </Box>


                                {sortedRecords.length === 0 ? (

                                    <Box className="no-maintenance">

                                        <Box>
                                            <AccessTime />
                                        </Box>

                                        <Typography>
                                            No maintenance records found
                                        </Typography>

                                        <span>
                                            Maintenance activity for this
                                            vehicle will appear here.
                                        </span>

                                    </Box>

                                ) : (

                                    <Box className="maintenance-timeline">

                                        {sortedRecords.map(
                                            (record, index) => (

                                                <Box
                                                    key={record.id}
                                                    className="timeline-item"
                                                >

                                                    <Box className="timeline-marker">

                                                        <Box className="timeline-dot">
                                                            <Build />
                                                        </Box>

                                                        {index !==
                                                            sortedRecords.length - 1 && (
                                                                <Box className="timeline-line" />
                                                            )}

                                                    </Box>


                                                    <Box className="timeline-content">

                                                        <Box className="timeline-top">

                                                            <Box>

                                                                <Typography className="timeline-service">
                                                                    {getServiceName(
                                                                        record
                                                                    )}
                                                                </Typography>

                                                                <Typography className="timeline-date">
                                                                    {formatDate(
                                                                        getDate(
                                                                            record
                                                                        )
                                                                    )}
                                                                </Typography>

                                                            </Box>


                                                            <Typography className="timeline-cost">
                                                                {formatCurrency(
                                                                    getCost(
                                                                        record
                                                                    )
                                                                )}
                                                            </Typography>

                                                        </Box>


                                                        <Typography className="timeline-description">

                                                            {record.description ||
                                                                "Vehicle maintenance service recorded for this vehicle."}

                                                        </Typography>


                                                        <Box className="timeline-status">

                                                            <CheckCircle />

                                                            <span>
                                                                {record.status ||
                                                                    "Completed"}
                                                            </span>

                                                        </Box>

                                                    </Box>

                                                </Box>

                                            )
                                        )}

                                    </Box>

                                )}

                            </Box>


                            {/* =================================
                                RIGHT SIDE ANALYSIS
                            ================================= */}

                            <Box className="maintenance-right-column">


                                {/* COST ANALYSIS */}

                                <Box className="maintenance-panel cost-panel">

                                    <Box className="maintenance-panel-heading">

                                        <Box className="maintenance-panel-icon">
                                            <Payments />
                                        </Box>

                                        <Box>

                                            <Typography>
                                                Maintenance Cost
                                            </Typography>

                                            <span>
                                                Service cost distribution
                                            </span>

                                        </Box>

                                    </Box>


                                    <Box className="cost-total">

                                        <span>
                                            TOTAL SPENDING
                                        </span>

                                        <strong>
                                            {formatCurrency(
                                                totalCost
                                            )}
                                        </strong>

                                    </Box>


                                    {sortedRecords.length > 0 ? (

                                        <Box className="cost-bars">

                                            {sortedRecords
                                                .slice(0, 5)
                                                .map(
                                                    record => {

                                                        const percentage =
                                                            (
                                                                getCost(record) /
                                                                maxCost
                                                            ) * 100;

                                                        return (

                                                            <Box
                                                                key={record.id}
                                                                className="cost-bar-row"
                                                            >

                                                                <Box className="cost-bar-label">

                                                                    <span>
                                                                        {getServiceName(
                                                                            record
                                                                        )}
                                                                    </span>

                                                                    <strong>
                                                                        {formatCurrency(
                                                                            getCost(
                                                                                record
                                                                            )
                                                                        )}
                                                                    </strong>

                                                                </Box>


                                                                <Box className="cost-bar">

                                                                    <Box
                                                                        style={{
                                                                            width:
                                                                                `${percentage}%`
                                                                        }}
                                                                    />

                                                                </Box>

                                                            </Box>

                                                        );

                                                    }
                                                )}

                                        </Box>

                                    ) : (

                                        <Box className="cost-empty">
                                            No cost data available
                                        </Box>

                                    )}

                                </Box>


                                {/* SERVICE INSIGHT */}

                                <Box className="maintenance-panel insight-panel">

                                    <Box className="insight-top">

                                        <Box className="insight-icon">
                                            <Engineering />
                                        </Box>

                                        <Typography>
                                            Maintenance Insight
                                        </Typography>

                                    </Box>


                                    <Typography className="insight-text">

                                        {totalServices === 0
                                            ? "No maintenance history is currently available for this vehicle."
                                            : `This vehicle has ${totalServices} recorded service ${totalServices === 1 ? "visit" : "visits"}, with total recorded maintenance spending of ${formatCurrency(totalCost)}.`}

                                    </Typography>


                                    <Box className="insight-footer">

                                        <span>
                                            SOBY ENGINEERS
                                        </span>

                                        <span>
                                            VEHICLE INTELLIGENCE
                                        </span>

                                    </Box>

                                </Box>

                            </Box>

                        </Box>

                    </Box>

                )}

        </Box>
    );
};


export default MaintenanceHistoryReport;