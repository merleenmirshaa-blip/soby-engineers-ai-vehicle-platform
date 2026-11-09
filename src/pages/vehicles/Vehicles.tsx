import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

import {
  AddRounded,
  DeleteRounded,
  DirectionsCarRounded,
  EditRounded,
  PsychologyRounded,
  RefreshRounded,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

// =====================================================
// VEHICLE INTERFACE
// =====================================================

interface Vehicle {
  id: number;
  user_id: number;

  vehicle_name: string;
  model: string;
  registration_number: string;

  manufacturer: string;
  fuel_type: string;

  purchase_date: string;

  mileage: number;

  engine_type?: string | null;
  vehicle_usage?: string | null;
}

// =====================================================
// AI PREDICTION INTERFACE
// =====================================================

interface Prediction {
  prediction?: string;
  health_score?: number;
  health_status?: string;
  probability?: number;
  recommendation?: string;
}

// =====================================================
// VEHICLES
// =====================================================

const Vehicles: React.FC = () => {

  const navigate = useNavigate();

  // ===================================================
  // STATE
  // ===================================================

  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [loading, setLoading] =
    useState<boolean>(true);

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [prediction, setPrediction] =
    useState<Prediction | null>(null);

  const [predictionLoading, setPredictionLoading] =
    useState<boolean>(false);

  // ===================================================
  // FETCH VEHICLES
  // ===================================================

  const fetchVehicles = async () => {

    try {

      setLoading(true);

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
          data.message ||
          "Failed to fetch vehicles."
        );
      }

      setVehicles(data);

    } catch (error) {

      console.error(
        "Vehicle fetch error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };

  // ===================================================
  // LOAD VEHICLES
  // ===================================================

  useEffect(() => {

    fetchVehicles();

  }, []);

  // ===================================================
  // DELETE VEHICLE
  // ===================================================

  const handleDelete = async (
    id: number
  ) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this vehicle?"
      );

    if (!confirmed) {
      return;
    }

    try {

      const token =
        localStorage.getItem("token");

      if (!token) {

        navigate("/login");

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/vehicles/${id}`,
        {
          method: "DELETE",

          headers: {
            Authorization:
              `Bearer ${token}`,
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
          "Failed to delete vehicle."
        );
      }

      alert(
        "Vehicle deleted successfully."
      );

      await fetchVehicles();

    } catch (error) {

      console.error(
        "Delete vehicle error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Failed to delete vehicle."
      );
    }
  };

  // ===================================================
  // AI PREDICTION
  // ===================================================

  const handlePrediction = async (
    vehicle: Vehicle
  ) => {

    try {

      setSelectedVehicle(vehicle);

      setPrediction(null);

      setPredictionLoading(true);

      const token =
        localStorage.getItem("token");

      if (!token) {

        navigate("/login");

        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/ai/vehicle/${vehicle.id}/predict`,
        {
          method: "GET",

          headers: {
            Authorization:
              `Bearer ${token}`,
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
          "Prediction failed."
        );
      }

      setPrediction(data);

    } catch (error) {

      console.error(
        "AI prediction error:",
        error
      );

      alert(
        error instanceof Error
          ? error.message
          : "Unable to generate AI prediction."
      );

    } finally {

      setPredictionLoading(false);

    }
  };

  // ===================================================
  // HEALTH STATUS COLOR
  // ===================================================

  const getStatusColor = (
    status?: string
  ):
    | "success"
    | "warning"
    | "error"
    | "default" => {

    if (!status) {
      return "default";
    }

    const value =
      status.toLowerCase();

    if (
      value.includes("excellent") ||
      value.includes("healthy")
    ) {

      return "success";
    }

    if (
      value.includes("attention")
    ) {

      return "warning";
    }

    if (
      value.includes("critical")
    ) {

      return "error";
    }

    return "default";
  };

  // ===================================================
  // LOADING
  // ===================================================

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "100vh",

          display: "flex",

          alignItems: "center",

          justifyContent: "center",

          backgroundColor: "#F8F5F0",
        }}
      >

        <CircularProgress
          sx={{
            color: "#651F2B",
          }}
        />

      </Box>
    );
  }

  // ===================================================
  // MAIN
  // ===================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",

        backgroundColor: "#F8F5F0",

        p: {
          xs: 2,
          md: 4,
        },
      }}
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <Box
        sx={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: {
            xs: "flex-start",
            md: "center",
          },

          flexDirection: {
            xs: "column",
            md: "row",
          },

          gap: 2,

          mb: 4,
        }}
      >

        <Box>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,

              color: "#651F2B",

              mb: 0.5,
            }}
          >
            My Vehicles
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#777",
            }}
          >
            Manage your vehicles and monitor their AI health.
          </Typography>

        </Box>

        <Stack
          direction="row"
          spacing={1.5}
        >

          {/* REFRESH */}

          <Button
            variant="outlined"
            startIcon={
              <RefreshRounded />
            }
            onClick={fetchVehicles}
            sx={{
              borderColor: "#B08D57",

              color: "#651F2B",

              borderRadius: 2,

              "&:hover": {
                borderColor: "#651F2B",

                backgroundColor:
                  "#F0E1C8",
              },
            }}
          >
            Refresh
          </Button>

          {/* ADD VEHICLE */}

          <Button
            variant="contained"
            startIcon={
              <AddRounded />
            }
            onClick={() =>
              navigate("/vehicles/add")
            }
            sx={{
              backgroundColor:
                "#651F2B",

              borderRadius: 2,

              px: 2.5,

              "&:hover": {
                backgroundColor:
                  "#4D1721",
              },
            }}
          >
            Add Vehicle
          </Button>

        </Stack>

      </Box>

      {/* =================================================
          VEHICLE COUNT
      ================================================= */}

      <Card
        sx={{
          mb: 3,

          borderRadius: 3,

          boxShadow:
            "0 8px 25px rgba(0,0,0,0.06)",
        }}
      >

        <CardContent>

          <Stack
            direction="row"
            alignItems="center"
            spacing={2}
          >

            <Box
              sx={{
                width: 52,

                height: 52,

                borderRadius: 2,

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                backgroundColor:
                  "#F0E1C8",
              }}
            >

              <DirectionsCarRounded
                sx={{
                  color: "#651F2B",

                  fontSize: 30,
                }}
              />

            </Box>

            <Box>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Vehicles
              </Typography>

              <Typography
                variant="h5"
                fontWeight={800}
                color="#651F2B"
              >
                {vehicles.length}
              </Typography>

            </Box>

          </Stack>

        </CardContent>

      </Card>

      {/* =================================================
          VEHICLE TABLE
      ================================================= */}

      <Card
        sx={{
          borderRadius: 3,

          boxShadow:
            "0 8px 30px rgba(0,0,0,0.07)",

          overflow: "hidden",
        }}
      >

        <TableContainer>

          <Table>

            <TableHead>

              <TableRow
                sx={{
                  backgroundColor:
                    "#651F2B",
                }}
              >

                <TableCell
                  sx={{
                    color: "#FFF",
                    fontWeight: 700,
                  }}
                >
                  Vehicle
                </TableCell>

                <TableCell
                  sx={{
                    color: "#FFF",
                    fontWeight: 700,
                  }}
                >
                  Registration
                </TableCell>

                <TableCell
                  sx={{
                    color: "#FFF",
                    fontWeight: 700,
                  }}
                >
                  Fuel
                </TableCell>

                <TableCell
                  sx={{
                    color: "#FFF",
                    fontWeight: 700,
                  }}
                >
                  Mileage
                </TableCell>

                <TableCell
                  sx={{
                    color: "#FFF",
                    fontWeight: 700,
                  }}
                >
                  Usage
                </TableCell>

                <TableCell
                  align="center"
                  sx={{
                    color: "#FFF",
                    fontWeight: 700,
                  }}
                >
                  Actions
                </TableCell>

              </TableRow>

            </TableHead>

            <TableBody>

              {vehicles.length === 0 ? (

                <TableRow>

                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{
                      py: 6,
                    }}
                  >

                    <DirectionsCarRounded
                      sx={{
                        fontSize: 50,

                        color: "#B08D57",

                        mb: 1,
                      }}
                    />

                    <Typography
                      variant="h6"
                      fontWeight={700}
                      color="#651F2B"
                    >
                      No Vehicles Found
                    </Typography>

                    <Typography
                      color="text.secondary"
                      sx={{
                        mb: 2,
                      }}
                    >
                      Add your first vehicle to get started.
                    </Typography>

                    <Button
                      variant="contained"
                      startIcon={
                        <AddRounded />
                      }
                      onClick={() =>
                        navigate(
                          "/vehicles/add"
                        )
                      }
                      sx={{
                        backgroundColor:
                          "#651F2B",

                        "&:hover": {
                          backgroundColor:
                            "#4D1721",
                        },
                      }}
                    >
                      Add Vehicle
                    </Button>

                  </TableCell>

                </TableRow>

              ) : (

                vehicles.map(
                  (vehicle) => (

                    <TableRow
                      key={vehicle.id}
                      hover
                    >

                      {/* VEHICLE */}

                      <TableCell>

                        <Box>

                          <Typography
                            fontWeight={700}
                            color="#651F2B"
                          >
                            {vehicle.vehicle_name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {vehicle.manufacturer}{" "}
                            {vehicle.model}
                          </Typography>

                        </Box>

                      </TableCell>

                      {/* REGISTRATION */}

                      <TableCell>

                        <Typography
                          fontWeight={600}
                        >
                          {
                            vehicle.registration_number
                          }
                        </Typography>

                      </TableCell>

                      {/* FUEL */}

                      <TableCell>

                        <Chip
                          label={
                            vehicle.fuel_type
                          }
                          size="small"
                          sx={{
                            backgroundColor:
                              "#F0E1C8",

                            color:
                              "#651F2B",

                            fontWeight: 600,
                          }}
                        />

                      </TableCell>

                      {/* MILEAGE */}

                      <TableCell>

                        {vehicle.mileage
                          ? `${vehicle.mileage.toLocaleString()} km`
                          : "N/A"}

                      </TableCell>

                      {/* USAGE */}

                      <TableCell>

                        {vehicle.vehicle_usage ||
                          "N/A"}

                      </TableCell>

                      {/* ACTIONS */}

                      <TableCell
                        align="center"
                      >

                        <Stack
                          direction="row"
                          justifyContent="center"
                          spacing={0.5}
                        >

                          {/* AI */}

                          <IconButton
                            onClick={() =>
                              handlePrediction(
                                vehicle
                              )
                            }
                            title="AI Prediction"
                            sx={{
                              color:
                                "#B08D57",
                            }}
                          >

                            <PsychologyRounded />

                          </IconButton>

                          {/* EDIT */}

                          <IconButton
                            onClick={() =>
                              navigate(
                                `/vehicles/edit/${vehicle.id}`
                              )
                            }
                            title="Edit Vehicle"
                            sx={{
                              color:
                                "#651F2B",
                            }}
                          >

                            <EditRounded />

                          </IconButton>

                          {/* DELETE */}

                          <IconButton
                            onClick={() =>
                              handleDelete(
                                vehicle.id
                              )
                            }
                            title="Delete Vehicle"
                            sx={{
                              color:
                                "#B3261E",
                            }}
                          >

                            <DeleteRounded />

                          </IconButton>

                        </Stack>

                      </TableCell>

                    </TableRow>

                  )
                )

              )}

            </TableBody>

          </Table>

        </TableContainer>

      </Card>

      {/* =================================================
          AI PREDICTION DIALOG
      ================================================= */}

      <Dialog
        open={
          Boolean(selectedVehicle)
        }
        onClose={() => {

          setSelectedVehicle(null);

          setPrediction(null);

        }}
        fullWidth
        maxWidth="sm"
      >

        <DialogTitle
          sx={{
            color: "#651F2B",

            fontWeight: 800,
          }}
        >
          AI Vehicle Health Prediction
        </DialogTitle>

        <DialogContent>

          {selectedVehicle && (

            <Box>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  mb: 1,
                }}
              >
                {selectedVehicle.vehicle_name}{" "}
                {selectedVehicle.model}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{
                  mb: 3,
                }}
              >
                Registration:{" "}
                {
                  selectedVehicle.registration_number
                }
              </Typography>

              {/* LOADING */}

              {predictionLoading ? (

                <Box
                  sx={{
                    py: 5,

                    display: "flex",

                    justifyContent:
                      "center",
                  }}
                >

                  <CircularProgress
                    sx={{
                      color:
                        "#651F2B",
                    }}
                  />

                </Box>

              ) : prediction ? (

                <Stack spacing={2}>

                  {/* MAINTENANCE PREDICTION */}

                  <Box
                    sx={{
                      p: 2,

                      borderRadius: 2,

                      backgroundColor:
                        "#F8F5F0",
                    }}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Maintenance Prediction
                    </Typography>

                    <Typography
                      variant="h5"
                      fontWeight={800}
                      color="#651F2B"
                    >
                      {
                        prediction.prediction ||
                        "N/A"
                      }
                    </Typography>

                  </Box>

                  {/* VEHICLE HEALTH */}

                  <Box
                    sx={{
                      p: 2,

                      borderRadius: 2,

                      backgroundColor:
                        "#F8F5F0",
                    }}
                  >

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      Vehicle Health
                    </Typography>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={2}
                    >

                      <Typography
                        variant="h4"
                        fontWeight={800}
                        color="#651F2B"
                      >
                        {
                          prediction.health_score ??
                          "N/A"
                        }
                      </Typography>

                      <Chip
                        label={
                          prediction.health_status ||
                          "Unknown"
                        }
                        color={
                          getStatusColor(
                            prediction.health_status
                          )
                        }
                      />

                    </Stack>

                  </Box>

                  {/* PROBABILITY */}

                  {prediction.probability !==
                    undefined && (

                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,

                        backgroundColor:
                          "#F8F5F0",
                      }}
                    >

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Prediction Probability
                      </Typography>

                      <Typography
                        variant="h6"
                        fontWeight={700}
                        color="#651F2B"
                      >
                        {
                          prediction.probability
                        }%
                      </Typography>

                    </Box>

                  )}

                  {/* RECOMMENDATION */}

                  {prediction.recommendation && (

                    <Box
                      sx={{
                        p: 2,

                        borderRadius: 2,

                        borderLeft:
                          "4px solid #B08D57",

                        backgroundColor:
                          "#FFFDF8",
                      }}
                    >

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Recommendation
                      </Typography>

                      <Typography
                        sx={{
                          mt: 0.5,
                        }}
                      >
                        {
                          prediction.recommendation
                        }
                      </Typography>

                    </Box>

                  )}

                </Stack>

              ) : (

                <Typography
                  color="text.secondary"
                >
                  Click the AI button to generate the vehicle health prediction.
                </Typography>

              )}

            </Box>

          )}

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => {

              setSelectedVehicle(null);

              setPrediction(null);

            }}
            sx={{
              color: "#651F2B",
            }}
          >
            Close
          </Button>

        </DialogActions>

      </Dialog>

    </Box>
  );
};

export default Vehicles;