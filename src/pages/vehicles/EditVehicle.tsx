import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  CircularProgress,
  IconButton,
  Alert,
} from "@mui/material";

import {
  ArrowBack,
  DirectionsCar,
  Save,
} from "@mui/icons-material";

import { useNavigate, useParams } from "react-router-dom";

interface Vehicle {
  id: number;
  user_id: number;
  vehicle_name: string;
  model: string;
  registration_number: string;
  manufacturer?: string;
  fuel_type: string;
  purchase_date?: string;
  mileage?: number;
  engine_type?: string;
  vehicle_usage?: string;
}

interface FormData {
  vehicle_name: string;
  model: string;
  registration_number: string;
  manufacturer: string;
  fuel_type: string;
  purchase_date: string;
  mileage: string;
  engine_type: string;
  vehicle_usage: string;
}

const EditVehicle: React.FC = () => {
  const navigate = useNavigate();

  const { id } = useParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState<FormData>({
    vehicle_name: "",
    model: "",
    registration_number: "",
    manufacturer: "",
    fuel_type: "",
    purchase_date: "",
    mileage: "",
    engine_type: "",
    vehicle_usage: "",
  });

  // =====================================================
  // LOAD VEHICLE
  // =====================================================

  useEffect(() => {
    const loadVehicle = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        if (!id) {
          setError("Vehicle ID is missing.");
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

        if (response.status === 401) {
          localStorage.removeItem("token");
          navigate("/login");
          return;
        }

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Unable to load vehicles."
          );
        }

        const vehicle: Vehicle | undefined = data.find(
          (item: Vehicle) => item.id === Number(id)
        );

        if (!vehicle) {
          setError("Vehicle not found.");
          return;
        }

        setFormData({
          vehicle_name: vehicle.vehicle_name || "",
          model: vehicle.model || "",
          registration_number:
            vehicle.registration_number || "",
          manufacturer:
            vehicle.manufacturer || "",
          fuel_type:
            vehicle.fuel_type || "",
          purchase_date: vehicle.purchase_date
            ? vehicle.purchase_date.substring(0, 10)
            : "",
          mileage:
            vehicle.mileage !== undefined &&
            vehicle.mileage !== null
              ? String(vehicle.mileage)
              : "",
          engine_type:
            vehicle.engine_type || "",
          vehicle_usage:
            vehicle.vehicle_usage || "",
        });
      } catch (err) {
        console.error("Load vehicle error:", err);

        setError(
          err instanceof Error
            ? err.message
            : "Unable to load vehicle."
        );
      } finally {
        setLoading(false);
      }
    };

    loadVehicle();
  }, [id, navigate]);

  // =====================================================
  // TEXT FIELD CHANGE
  // =====================================================

  const handleTextChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // SELECT CHANGE
  // =====================================================

  const handleSelectChange = (
    event: React.ChangeEvent<{ value: unknown }>
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: String(value),
    }));

    setError("");
    setSuccess("");
  };

  // =====================================================
  // UPDATE VEHICLE
  // =====================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      !formData.vehicle_name.trim() ||
      !formData.model.trim() ||
      !formData.registration_number.trim() ||
      !formData.fuel_type ||
      !formData.engine_type ||
      !formData.vehicle_usage
    ) {
      setError(
        "Please fill all required vehicle fields."
      );
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!id) {
        setError("Vehicle ID is missing.");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            vehicle_name:
              formData.vehicle_name.trim(),

            model:
              formData.model.trim(),

            registration_number:
              formData.registration_number.trim(),

            manufacturer:
              formData.manufacturer.trim(),

            fuel_type:
              formData.fuel_type,

            purchase_date:
              formData.purchase_date || null,

            mileage:
              formData.mileage
                ? Number(formData.mileage)
                : 0,

            engine_type:
              formData.engine_type,

            vehicle_usage:
              formData.vehicle_usage,
          }),
        }
      );

      if (response.status === 401) {
        localStorage.removeItem("token");
        navigate("/login");
        return;
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update vehicle."
        );
      }

      setSuccess(
        "Vehicle updated successfully."
      );

      setTimeout(() => {
        navigate("/vehicles");
      }, 1000);
    } catch (err) {
      console.error("Update vehicle error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to update vehicle."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background:
            "linear-gradient(135deg, #fffaf0, #f8f1e5)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
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
            Loading vehicle details...
          </Typography>
        </Box>
      </Box>
    );
  }

  // =====================================================
  // PAGE
  // =====================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: 4,
        background:
          "linear-gradient(135deg, #fffaf0 0%, #f8f1e5 50%, #fffdf8 100%)",
      }}
    >
      <Container maxWidth="lg">

        {/* HEADER */}

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            mb: 4,
          }}
        >
          <IconButton
            onClick={() => navigate("/vehicles")}
            sx={{
              width: 48,
              height: 48,
              backgroundColor: "#7A1F3D",
              color: "#fff",

              "&:hover": {
                backgroundColor: "#5E1730",
              },
            }}
          >
            <ArrowBack />
          </IconButton>

          <Box>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                color: "#5E1730",
              }}
            >
              Edit Vehicle
            </Typography>

            <Typography
              sx={{
                color: "#7b6257",
                mt: 0.5,
              }}
            >
              Update your vehicle information
            </Typography>
          </Box>
        </Box>

        {/* ERROR */}

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

        {/* SUCCESS */}

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

        {/* FORM CARD */}

        <Paper
          elevation={0}
          sx={{
            p: {
              xs: 2.5,
              md: 5,
            },
            borderRadius: 4,
            backgroundColor:
              "rgba(255,255,255,0.95)",
            border:
              "1px solid rgba(122,31,61,0.12)",
            boxShadow:
              "0 18px 50px rgba(94,23,48,0.10)",
          }}
        >

          {/* FORM TITLE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 4,
              pb: 3,
              borderBottom:
                "1px solid rgba(122,31,61,0.10)",
            }}
          >
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: 2.5,
                backgroundColor: "#7A1F3D",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DirectionsCar
                sx={{
                  color: "#D4AF37",
                  fontSize: 30,
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
                Vehicle Information
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#806b61",
                }}
              >
                Modify the details and save your
                changes.
              </Typography>
            </Box>
          </Box>

          {/* FORM */}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >
            <Grid
              container
              spacing={3}
            >

              {/* VEHICLE NAME */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Vehicle Name"
                  name="vehicle_name"
                  value={formData.vehicle_name}
                  onChange={handleTextChange}
                />
              </Grid>

              {/* MODEL */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Model"
                  name="model"
                  value={formData.model}
                  onChange={handleTextChange}
                />
              </Grid>

              {/* REGISTRATION */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  required
                  label="Registration Number"
                  name="registration_number"
                  value={
                    formData.registration_number
                  }
                  onChange={handleTextChange}
                />
              </Grid>

              {/* MANUFACTURER */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Manufacturer"
                  name="manufacturer"
                  value={formData.manufacturer}
                  onChange={handleTextChange}
                />
              </Grid>

              {/* FUEL TYPE */}

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  required
                >
                  <InputLabel>
                    Fuel Type
                  </InputLabel>

                  <Select
                    name="fuel_type"
                    value={formData.fuel_type}
                    label="Fuel Type"
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        fuel_type:
                          event.target.value,
                      }));

                      setError("");
                      setSuccess("");
                    }}
                  >
                    <MenuItem value="Petrol">
                      Petrol
                    </MenuItem>

                    <MenuItem value="Diesel">
                      Diesel
                    </MenuItem>

                    <MenuItem value="Electric">
                      Electric
                    </MenuItem>

                    <MenuItem value="Hybrid">
                      Hybrid
                    </MenuItem>

                    <MenuItem value="CNG">
                      CNG
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* ENGINE TYPE */}

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  required
                >
                  <InputLabel>
                    Engine Type
                  </InputLabel>

                  <Select
                    name="engine_type"
                    value={formData.engine_type}
                    label="Engine Type"
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        engine_type:
                          event.target.value,
                      }));

                      setError("");
                      setSuccess("");
                    }}
                  >
                    <MenuItem value="Low">
                      Low
                    </MenuItem>

                    <MenuItem value="Medium">
                      Medium
                    </MenuItem>

                    <MenuItem value="High">
                      High
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* VEHICLE USAGE */}

              <Grid item xs={12} md={6}>
                <FormControl
                  fullWidth
                  required
                >
                  <InputLabel>
                    Vehicle Usage
                  </InputLabel>

                  <Select
                    name="vehicle_usage"
                    value={formData.vehicle_usage}
                    label="Vehicle Usage"
                    onChange={(event) => {
                      setFormData((previous) => ({
                        ...previous,
                        vehicle_usage:
                          event.target.value,
                      }));

                      setError("");
                      setSuccess("");
                    }}
                  >
                    <MenuItem value="Low">
                      Low
                    </MenuItem>

                    <MenuItem value="Medium">
                      Medium
                    </MenuItem>

                    <MenuItem value="High">
                      High
                    </MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              {/* MILEAGE */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Mileage (km)"
                  name="mileage"
                  type="number"
                  value={formData.mileage}
                  onChange={handleTextChange}
                  inputProps={{
                    min: 0,
                  }}
                />
              </Grid>

              {/* PURCHASE DATE */}

              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Purchase Date"
                  name="purchase_date"
                  type="date"
                  value={formData.purchase_date}
                  onChange={handleTextChange}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
            </Grid>

            {/* BUTTONS */}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 5,
                pt: 3,
                borderTop:
                  "1px solid rgba(122,31,61,0.10)",
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  navigate("/vehicles")
                }
                sx={{
                  px: 4,
                  py: 1.3,
                  borderRadius: 2,
                  borderColor: "#7A1F3D",
                  color: "#7A1F3D",
                  fontWeight: 700,

                  "&:hover": {
                    borderColor: "#5E1730",
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
                disabled={saving}
                startIcon={
                  saving ? (
                    <CircularProgress
                      size={18}
                      sx={{
                        color: "#fff",
                      }}
                    />
                  ) : (
                    <Save />
                  )
                }
                sx={{
                  px: 4,
                  py: 1.3,
                  borderRadius: 2,
                  backgroundColor: "#7A1F3D",
                  fontWeight: 700,

                  "&:hover": {
                    backgroundColor: "#5E1730",
                  },
                }}
              >
                {saving
                  ? "Updating..."
                  : "Update Vehicle"}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditVehicle;