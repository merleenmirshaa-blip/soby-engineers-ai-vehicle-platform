import React, { useEffect, useState } from "react";

import {
    Alert,
    Box,
    Button,
    CircularProgress,
    Container,
    FormControl,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    TextField,
    Typography,
} from "@mui/material";

import {
    ArrowBack,
    Build,
    Save,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =====================================================
// TYPES
// =====================================================

interface Vehicle {
    id: number;
    vehicle_name: string;
    registration_number: string;
    model?: string;
    manufacturer?: string;
}

// =====================================================
// ADD MAINTENANCE
// =====================================================

const AddMaintenance: React.FC = () => {

    const navigate = useNavigate();

    // =====================================================
    // STATE
    // =====================================================

    const [vehicles, setVehicles] =
        useState<Vehicle[]>([]);

    const [loadingVehicles, setLoadingVehicles] =
        useState<boolean>(true);

    const [saving, setSaving] =
        useState<boolean>(false);

    const [error, setError] =
        useState<string>("");

    const [success, setSuccess] =
        useState<string>("");

    // =====================================================
    // FORM STATE
    // =====================================================

    const [vehicleId, setVehicleId] =
        useState<string>("");

    const [serviceType, setServiceType] =
        useState<string>("");

    const [serviceDate, setServiceDate] =
        useState<string>("");

    const [nextServiceDate, setNextServiceDate] =
        useState<string>("");

    const [mileageAtService, setMileageAtService] =
        useState<string>("");

    const [cost, setCost] =
        useState<string>("");

    const [serviceCenter, setServiceCenter] =
        useState<string>("");

    const [notes, setNotes] =
        useState<string>("");

    // =====================================================
    // GET TOKEN
    // =====================================================

    const getToken = (): string | null => {
        return localStorage.getItem("token");
    };

    // =====================================================
    // FETCH VEHICLES
    // =====================================================

    const fetchVehicles = async () => {

        try {

            setLoadingVehicles(true);
            setError("");

            const token = getToken();

            if (!token) {
                navigate("/login");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/vehicles",
                {
                    method: "GET",

                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json();

            console.log(
                "Vehicles Response:",
                data
            );

            // =================================================
            // TOKEN ERROR
            // =================================================

            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            // =================================================
            // API ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Failed to load vehicles."
                );
            }

            // =================================================
            // RESPONSE FORMAT
            // =================================================

            if (Array.isArray(data)) {

                setVehicles(data);

            } else if (
                Array.isArray(data.vehicles)
            ) {

                setVehicles(data.vehicles);

            } else if (
                Array.isArray(data.data)
            ) {

                setVehicles(data.data);

            } else {

                setVehicles([]);
            }

        } catch (err) {

            console.error(
                "Fetch Vehicles Error:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to load vehicles."
            );

        } finally {

            setLoadingVehicles(false);
        }
    };

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(() => {
        fetchVehicles();
    }, []);

    // =====================================================
    // SUBMIT FORM
    // =====================================================

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {

        event.preventDefault();

        setError("");
        setSuccess("");

        // =================================================
        // VALIDATION
        // =================================================

        if (!vehicleId) {

            setError(
                "Please select a vehicle."
            );

            return;
        }

        if (!serviceType.trim()) {

            setError(
                "Please enter the service type."
            );

            return;
        }

        if (!serviceDate) {

            setError(
                "Please select the service date."
            );

            return;
        }

        // =================================================
        // DATE VALIDATION
        // =================================================

        if (
            nextServiceDate &&
            nextServiceDate < serviceDate
        ) {

            setError(
                "Next service date cannot be earlier than service date."
            );

            return;
        }

        // =================================================
        // NUMBER VALIDATION
        // =================================================

        if (
            mileageAtService &&
            Number(mileageAtService) < 0
        ) {

            setError(
                "Mileage cannot be negative."
            );

            return;
        }

        if (
            cost &&
            Number(cost) < 0
        ) {

            setError(
                "Cost cannot be negative."
            );

            return;
        }

        try {

            setSaving(true);

            const token = getToken();

            if (!token) {

                navigate("/login");

                return;
            }

            // =================================================
            // REQUEST BODY
            // =================================================

            const requestBody = {
                vehicle_id: Number(vehicleId),

                service_type:
                    serviceType.trim(),

                service_date:
                    serviceDate,

                next_service_date:
                    nextServiceDate || null,

                mileage_at_service:
                    mileageAtService
                        ? Number(mileageAtService)
                        : null,

                cost:
                    cost
                        ? Number(cost)
                        : null,

                service_center:
                    serviceCenter.trim() || null,

                notes:
                    notes.trim() || null,
            };

            console.log(
                "================================"
            );

            console.log(
                "ADDING MAINTENANCE"
            );

            console.log(
                "Request Body:",
                requestBody
            );

            console.log(
                "Vehicle ID:",
                Number(vehicleId)
            );

            console.log(
                "================================"
            );

            // =================================================
            // POST API
            // IMPORTANT: /add
            // =================================================

            const response = await fetch(
                "http://localhost:5000/api/maintenance/add",
                {
                    method: "POST",

                    headers: {
                        Authorization:
                            `Bearer ${token}`,

                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify(
                        requestBody
                    ),
                }
            );

            const data =
                await response.json();

            console.log(
                "Add Maintenance Response:",
                data
            );

            // =================================================
            // TOKEN ERROR
            // =================================================

            if (response.status === 401) {

                localStorage.removeItem("token");

                navigate("/login");

                return;
            }

            // =================================================
            // API ERROR
            // =================================================

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to add maintenance record."
                );
            }

            // =================================================
            // SUCCESS
            // =================================================

            setSuccess(
                "Maintenance record added successfully!"
            );

            // =================================================
            // RESET FORM
            // =================================================

            setVehicleId("");
            setServiceType("");
            setServiceDate("");
            setNextServiceDate("");
            setMileageAtService("");
            setCost("");
            setServiceCenter("");
            setNotes("");

            // =================================================
            // REDIRECT
            // =================================================

            setTimeout(() => {

                navigate("/maintenance");

            }, 1000);

        } catch (err) {

            console.error(
                "Add Maintenance Error:",
                err
            );

            setError(
                err instanceof Error
                    ? err.message
                    : "Unable to add maintenance record."
            );

        } finally {

            setSaving(false);
        }
    };

    // =====================================================
    // LOADING
    // =====================================================

    if (loadingVehicles) {

        return (

            <Box
                sx={{
                    minHeight: "100vh",

                    background:
                        "linear-gradient(135deg, #fffaf0 0%, #f8f1e5 50%, #fffdf8 100%)",

                    display: "flex",

                    alignItems: "center",

                    justifyContent: "center",
                }}
            >

                <Box
                    sx={{
                        textAlign: "center",
                    }}
                >

                    <CircularProgress
                        sx={{
                            color: "#7A1F3D",
                        }}
                    />

                    <Typography
                        sx={{
                            mt: 2,

                            color: "#6b4b3e",

                            fontWeight: 600,
                        }}
                    >
                        Loading vehicles...
                    </Typography>

                </Box>

            </Box>
        );
    }

    // =====================================================
    // MAIN PAGE
    // =====================================================

    return (

        <Box
            sx={{
                minHeight: "100vh",

                background:
                    "linear-gradient(135deg, #fffaf0 0%, #f8f1e5 50%, #fffdf8 100%)",

                py: 4,
            }}
        >

            <Container maxWidth="md">

                {/* =================================================
                    HEADER
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",

                        alignItems: "center",

                        gap: 2,

                        mb: 4,
                    }}
                >

                    <Button
                        onClick={() =>
                            navigate("/maintenance")
                        }

                        sx={{
                            minWidth: 48,

                            width: 48,

                            height: 48,

                            borderRadius: 2,

                            backgroundColor:
                                "#7A1F3D",

                            color: "#fff",

                            "&:hover": {
                                backgroundColor:
                                    "#5E1730",
                            },
                        }}
                    >
                        <ArrowBack />
                    </Button>

                    <Box>

                        <Typography
                            variant="h4"

                            sx={{
                                fontWeight: 800,

                                color: "#5E1730",
                            }}
                        >
                            Add Maintenance
                        </Typography>

                        <Typography
                            sx={{
                                color: "#7b6257",

                                mt: 0.5,
                            }}
                        >
                            Add a new vehicle service
                            and maintenance record
                        </Typography>

                    </Box>

                </Box>

                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <Alert
                        severity="error"

                        sx={{
                            mb: 3,

                            borderRadius: 2,
                        }}
                    >
                        {error}
                    </Alert>

                )}

                {/* =================================================
                    SUCCESS
                ================================================= */}

                {success && (

                    <Alert
                        severity="success"

                        sx={{
                            mb: 3,

                            borderRadius: 2,
                        }}
                    >
                        {success}
                    </Alert>

                )}

                {/* =================================================
                    FORM CARD
                ================================================= */}

                <Paper
                    elevation={0}

                    sx={{
                        borderRadius: 4,

                        p: {
                            xs: 3,
                            md: 5,
                        },

                        border:
                            "1px solid rgba(122,31,61,0.12)",

                        boxShadow:
                            "0 15px 40px rgba(94,23,48,0.08)",

                        background:
                            "rgba(255,255,255,0.94)",
                    }}
                >

                    {/* =================================================
                        FORM HEADER
                    ================================================= */}

                    <Box
                        sx={{
                            display: "flex",

                            alignItems: "center",

                            gap: 2,

                            mb: 4,
                        }}
                    >

                        <Box
                            sx={{
                                width: 54,

                                height: 54,

                                borderRadius: 2,

                                display: "flex",

                                alignItems: "center",

                                justifyContent: "center",

                                backgroundColor:
                                    "#7A1F3D",
                            }}
                        >

                            <Build
                                sx={{
                                    color: "#D4AF37",

                                    fontSize: 28,
                                }}
                            />

                        </Box>

                        <Box>

                            <Typography
                                variant="h6"

                                sx={{
                                    fontWeight: 800,

                                    color: "#5E1730",
                                }}
                            >
                                Service Information
                            </Typography>

                            <Typography
                                variant="body2"

                                sx={{
                                    color: "#806b61",
                                }}
                            >
                                Enter the maintenance
                                details below
                            </Typography>

                        </Box>

                    </Box>

                    {/* =================================================
                        FORM
                    ================================================= */}

                    <Box
                        component="form"
                        onSubmit={handleSubmit}
                    >

                        {/* =================================================
                            VEHICLE
                        ================================================= */}

                        <Box
                            sx={{
                                mb: 3,
                            }}
                        >

                            <FormControl
                                fullWidth
                                required
                            >

                                <InputLabel>
                                    Vehicle
                                </InputLabel>

                                <Select
                                    value={vehicleId}

                                    label="Vehicle"

                                    onChange={(event) =>
                                        setVehicleId(
                                            String(
                                                event.target.value
                                            )
                                        )
                                    }
                                >

                                    <MenuItem value="">
                                        <em>
                                            Select Vehicle
                                        </em>
                                    </MenuItem>

                                    {vehicles.map(
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

                                                {" - "}

                                                {
                                                    vehicle.registration_number
                                                }

                                                {vehicle.model
                                                    ? ` (${vehicle.model})`
                                                    : ""}

                                            </MenuItem>

                                        )
                                    )}

                                </Select>

                            </FormControl>

                        </Box>

                        {/* =================================================
                            TWO COLUMN SECTION
                        ================================================= */}

                        <Box
                            sx={{
                                display: "grid",

                                gridTemplateColumns: {
                                    xs: "1fr",
                                    md: "1fr 1fr",
                                },

                                gap: 3,
                            }}
                        >

                            {/* SERVICE TYPE */}

                            <TextField
                                fullWidth
                                required

                                label="Service Type"

                                placeholder="e.g. Oil Change"

                                value={
                                    serviceType
                                }

                                onChange={(event) =>
                                    setServiceType(
                                        event.target.value
                                    )
                                }
                            />

                            {/* SERVICE DATE */}

                            <TextField
                                fullWidth
                                required

                                type="date"

                                label="Service Date"

                                value={
                                    serviceDate
                                }

                                onChange={(event) =>
                                    setServiceDate(
                                        event.target.value
                                    )
                                }

                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />

                            {/* NEXT SERVICE DATE */}

                            <TextField
                                fullWidth

                                type="date"

                                label="Next Service Date"

                                value={
                                    nextServiceDate
                                }

                                onChange={(event) =>
                                    setNextServiceDate(
                                        event.target.value
                                    )
                                }

                                slotProps={{
                                    inputLabel: {
                                        shrink: true,
                                    },
                                }}
                            />

                            {/* MILEAGE */}

                            <TextField
                                fullWidth

                                type="number"

                                label="Mileage at Service"

                                placeholder="e.g. 125000"

                                value={
                                    mileageAtService
                                }

                                onChange={(event) =>
                                    setMileageAtService(
                                        event.target.value
                                    )
                                }
                            />

                            {/* COST */}

                            <TextField
                                fullWidth

                                type="number"

                                label="Cost"

                                placeholder="e.g. 2500"

                                value={cost}

                                onChange={(event) =>
                                    setCost(
                                        event.target.value
                                    )
                                }
                            />

                            {/* SERVICE CENTER */}

                            <TextField
                                fullWidth

                                label="Service Center"

                                placeholder="e.g. Soby Engineers"

                                value={
                                    serviceCenter
                                }

                                onChange={(event) =>
                                    setServiceCenter(
                                        event.target.value
                                    )
                                }
                            />

                        </Box>

                        {/* =================================================
                            NOTES
                        ================================================= */}

                        <Box
                            sx={{
                                mt: 3,
                            }}
                        >

                            <TextField
                                fullWidth

                                multiline

                                rows={4}

                                label="Notes"

                                placeholder="Enter additional maintenance details..."

                                value={notes}

                                onChange={(event) =>
                                    setNotes(
                                        event.target.value
                                    )
                                }
                            />

                        </Box>

                        {/* =================================================
                            BUTTONS
                        ================================================= */}

                        <Box
                            sx={{
                                display: "flex",

                                justifyContent:
                                    "flex-end",

                                gap: 2,

                                mt: 4,

                                flexWrap: "wrap",
                            }}
                        >

                            <Button
                                type="button"

                                variant="outlined"

                                onClick={() =>
                                    navigate(
                                        "/maintenance"
                                    )
                                }

                                disabled={saving}

                                sx={{
                                    px: 3,

                                    py: 1.3,

                                    borderRadius: 2,

                                    borderColor:
                                        "#7A1F3D",

                                    color:
                                        "#7A1F3D",

                                    fontWeight: 700,

                                    "&:hover": {
                                        borderColor:
                                            "#5E1730",

                                        backgroundColor:
                                            "rgba(122,31,61,0.05)",
                                    },
                                }}
                            >
                                Cancel
                            </Button>

                            <Button
                                type="submit"

                                variant="contained"

                                startIcon={
                                    saving ? (

                                        <CircularProgress
                                            size={20}

                                            sx={{
                                                color:
                                                    "#fff",
                                            }}
                                        />

                                    ) : (

                                        <Save />

                                    )
                                }

                                disabled={
                                    saving ||
                                    vehicles.length === 0
                                }

                                sx={{
                                    px: 3,

                                    py: 1.3,

                                    borderRadius: 2,

                                    backgroundColor:
                                        "#7A1F3D",

                                    color: "#fff",

                                    fontWeight: 700,

                                    "&:hover": {
                                        backgroundColor:
                                            "#5E1730",
                                    },
                                }}
                            >

                                {saving
                                    ? "Saving..."
                                    : "Save Maintenance"}

                            </Button>

                        </Box>

                    </Box>

                </Paper>

                {/* =================================================
                    NO VEHICLES
                ================================================= */}

                {vehicles.length === 0 && (

                    <Alert
                        severity="warning"

                        sx={{
                            mt: 3,

                            borderRadius: 2,
                        }}
                    >
                        No vehicles found. Please add a
                        vehicle before creating a
                        maintenance record.
                    </Alert>

                )}

            </Container>

        </Box>
    );
};

export default AddMaintenance;