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
import { useLocation, useNavigate } from "react-router-dom";

interface MaintenanceRecord {
    id: number;
    vehicle_id: number;
    vehicle_name?: string;
    registration_number?: string;
    model?: string;
    service_type: string;
    service_date: string;
    next_service_date?: string | null;
    mileage_at_service?: number | null;
    cost?: number | null;
    service_center?: string | null;
    notes?: string | null;
}

interface Vehicle {
    id: number;
    vehicle_name: string;
    registration_number: string;
    model?: string;
    manufacturer?: string;
}

const EditMaintenance: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const record =
        location.state?.maintenance as
            | MaintenanceRecord
            | undefined;

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [vehicleId, setVehicleId] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [serviceDate, setServiceDate] = useState("");
    const [nextServiceDate, setNextServiceDate] =
        useState("");
    const [mileageAtService, setMileageAtService] =
        useState("");
    const [cost, setCost] = useState("");
    const [serviceCenter, setServiceCenter] =
        useState("");
    const [notes, setNotes] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // ==========================================
    // LOAD EXISTING RECORD
    // ==========================================
    useEffect(() => {
        if (!record) {
            setError("Maintenance record not found.");
            setLoading(false);
            return;
        }

        setVehicleId(String(record.vehicle_id));

        setServiceType(
            record.service_type || ""
        );

        setServiceDate(
            record.service_date
                ? record.service_date.substring(0, 10)
                : ""
        );

        setNextServiceDate(
            record.next_service_date
                ? record.next_service_date.substring(0, 10)
                : ""
        );

        setMileageAtService(
            record.mileage_at_service !== null &&
            record.mileage_at_service !== undefined
                ? String(record.mileage_at_service)
                : ""
        );

        setCost(
            record.cost !== null &&
            record.cost !== undefined
                ? String(record.cost)
                : ""
        );

        setServiceCenter(
            record.service_center || ""
        );

        setNotes(record.notes || "");

        fetchVehicles();
    }, [record]);

    // ==========================================
    // FETCH VEHICLES
    // ==========================================
    const fetchVehicles = async () => {
        try {
            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const response = await fetch(
                "http://localhost:5000/api/vehicles",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type":
                            "application/json",
                    },
                }
            );

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to load vehicles"
                );
            }

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
        } catch (err: any) {
            setError(
                err.message ||
                    "Failed to load vehicles"
            );
        } finally {
            setLoading(false);
        }
    };

    // ==========================================
    // UPDATE MAINTENANCE
    // ==========================================
    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");

        if (!record) {
            setError(
                "Maintenance record not found."
            );
            return;
        }

        if (
            !vehicleId ||
            !serviceType.trim() ||
            !serviceDate
        ) {
            setError(
                "Vehicle, service type and service date are required."
            );
            return;
        }

        try {
            setSaving(true);

            const token =
                localStorage.getItem("token");

            if (!token) {
                navigate("/");
                return;
            }

            const requestBody = {
                service_type:
                    serviceType.trim(),

                service_date:
                    serviceDate,

                next_service_date:
                    nextServiceDate || null,

                mileage_at_service:
                    mileageAtService
                        ? Number(
                              mileageAtService
                          )
                        : null,

                cost: cost
                    ? Number(cost)
                    : null,

                service_center:
                    serviceCenter.trim() ||
                    null,

                notes:
                    notes.trim() || null,
            };

            console.log(
                "Updating Maintenance ID:",
                record.id
            );

            console.log(
                "Request Body:",
                requestBody
            );

            const response = await fetch(
                `http://localhost:5000/api/maintenance/${record.id}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
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

            if (response.status === 401) {
                localStorage.removeItem("token");
                navigate("/");
                return;
            }

            if (!response.ok) {
                throw new Error(
                    data.message ||
                        "Failed to update maintenance record"
                );
            }

            setSuccess(
                "Maintenance record updated successfully!"
            );

            setTimeout(() => {
                navigate("/maintenance");
            }, 1000);
        } catch (err: any) {
            console.error(
                "Update Maintenance Error:",
                err
            );

            setError(
                err.message ||
                    "Failed to update maintenance record"
            );
        } finally {
            setSaving(false);
        }
    };

    // ==========================================
    // RECORD NOT FOUND
    // ==========================================
    if (!loading && !record) {
        return (
            <Container
                maxWidth="md"
                sx={{ mt: 6 }}
            >
                <Alert severity="error">
                    Maintenance record not found.
                </Alert>

                <Button
                    sx={{ mt: 2 }}
                    startIcon={<ArrowBack />}
                    onClick={() =>
                        navigate(
                            "/maintenance"
                        )
                    }
                >
                    Back to Maintenance
                </Button>
            </Container>
        );
    }

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background:
                    "linear-gradient(135deg, #f4f7fb 0%, #ffffff 100%)",
                py: 5,
            }}
        >
            <Container maxWidth="md">

                {/* HEADER */}
                <Box
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        mb: 4,
                    }}
                >
                    <Button
                        variant="outlined"
                        startIcon={
                            <ArrowBack />
                        }
                        onClick={() =>
                            navigate(
                                "/maintenance"
                            )
                        }
                    >
                        Back
                    </Button>

                    <Box>
                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                color: "#0F2747",
                            }}
                        >
                            Edit Maintenance
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                        >
                            Update vehicle
                            maintenance details
                        </Typography>
                    </Box>
                </Box>

                {/* ERROR */}
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                    >
                        {error}
                    </Alert>
                )}

                {/* SUCCESS */}
                {success && (
                    <Alert
                        severity="success"
                        sx={{ mb: 3 }}
                    >
                        {success}
                    </Alert>
                )}

                <Paper
                    elevation={0}
                    sx={{
                        p: {
                            xs: 3,
                            md: 5,
                        },
                        borderRadius: 4,
                        border:
                            "1px solid #e3e8ef",
                    }}
                >
                    {/* SECTION TITLE */}
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1.5,
                            mb: 4,
                        }}
                    >
                        <Build
                            sx={{
                                color: "#1976D2",
                            }}
                        />

                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 700,
                                color: "#0F2747",
                            }}
                        >
                            Maintenance Information
                        </Typography>
                    </Box>

                    {loading ? (
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent:
                                    "center",
                                py: 6,
                            }}
                        >
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Box
                            component="form"
                            onSubmit={
                                handleSubmit
                            }
                        >
                            {/* FORM */}
                            <Box
                                sx={{
                                    display:
                                        "grid",
                                    gridTemplateColumns:
                                        {
                                            xs: "1fr",
                                            md: "1fr 1fr",
                                        },
                                    gap: 3,
                                }}
                            >
                                {/* VEHICLE */}
                                <FormControl
                                    fullWidth
                                >
                                    <InputLabel>
                                        Vehicle
                                    </InputLabel>

                                    <Select
                                        value={
                                            vehicleId
                                        }
                                        label="Vehicle"
                                        onChange={(
                                            event
                                        ) =>
                                            setVehicleId(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        {vehicles.map(
                                            (
                                                vehicle
                                            ) => (
                                                <MenuItem
                                                    key={
                                                        vehicle.id
                                                    }
                                                    value={
                                                        vehicle.id
                                                    }
                                                >
                                                    {
                                                        vehicle.vehicle_name
                                                    }{" "}
                                                    -{" "}
                                                    {
                                                        vehicle.registration_number
                                                    }
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>

                                {/* SERVICE TYPE */}
                                <FormControl
                                    fullWidth
                                    required
                                >
                                    <InputLabel>
                                        Service Type
                                    </InputLabel>

                                    <Select
                                        value={
                                            serviceType
                                        }
                                        label="Service Type"
                                        onChange={(
                                            event
                                        ) =>
                                            setServiceType(
                                                event
                                                    .target
                                                    .value
                                            )
                                        }
                                    >
                                        <MenuItem value="Oil Change">
                                            Oil Change
                                        </MenuItem>

                                        <MenuItem value="General Service">
                                            General Service
                                        </MenuItem>

                                        <MenuItem value="Brake Service">
                                            Brake Service
                                        </MenuItem>

                                        <MenuItem value="Engine Service">
                                            Engine Service
                                        </MenuItem>

                                        <MenuItem value="Tyre Replacement">
                                            Tyre Replacement
                                        </MenuItem>

                                        <MenuItem value="Battery Replacement">
                                            Battery Replacement
                                        </MenuItem>

                                        <MenuItem value="AC Service">
                                            AC Service
                                        </MenuItem>

                                        <MenuItem value="Other">
                                            Other
                                        </MenuItem>
                                    </Select>
                                </FormControl>

                                {/* SERVICE DATE */}
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Service Date"
                                    value={
                                        serviceDate
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setServiceDate(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    slotProps={{
                                        inputLabel:
                                            {
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
                                    onChange={(
                                        event
                                    ) =>
                                        setNextServiceDate(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    slotProps={{
                                        inputLabel:
                                            {
                                                shrink: true,
                                            },
                                    }}
                                />

                                {/* MILEAGE */}
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Mileage at Service"
                                    value={
                                        mileageAtService
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setMileageAtService(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                {/* COST */}
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Cost"
                                    value={cost}
                                    onChange={(
                                        event
                                    ) =>
                                        setCost(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                {/* SERVICE CENTER */}
                                <TextField
                                    fullWidth
                                    label="Service Center"
                                    value={
                                        serviceCenter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setServiceCenter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                />

                                {/* NOTES */}
                                <TextField
                                    fullWidth
                                    label="Notes"
                                    value={notes}
                                    onChange={(
                                        event
                                    ) =>
                                        setNotes(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    multiline
                                    minRows={4}
                                    sx={{
                                        gridColumn:
                                            {
                                                xs: "auto",
                                                md: "1 / -1",
                                            },
                                    }}
                                />
                            </Box>

                            {/* BUTTONS */}
                            <Box
                                sx={{
                                    display:
                                        "flex",
                                    justifyContent:
                                        "flex-end",
                                    gap: 2,
                                    mt: 4,
                                }}
                            >
                                <Button
                                    variant="outlined"
                                    onClick={() =>
                                        navigate(
                                            "/maintenance"
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                >
                                    Cancel
                                </Button>

                                <Button
                                    type="submit"
                                    variant="contained"
                                    startIcon={
                                        saving ? (
                                            <CircularProgress
                                                size={
                                                    18
                                                }
                                                color="inherit"
                                            />
                                        ) : (
                                            <Save />
                                        )
                                    }
                                    disabled={
                                        saving
                                    }
                                    sx={{
                                        backgroundColor:
                                            "#1976D2",
                                        px: 4,
                                        "&:hover":
                                            {
                                                backgroundColor:
                                                    "#125EA8",
                                            },
                                    }}
                                >
                                    {saving
                                        ? "Updating..."
                                        : "Update Maintenance"}
                                </Button>
                            </Box>
                        </Box>
                    )}
                </Paper>
            </Container>
        </Box>
    );
};

export default EditMaintenance;