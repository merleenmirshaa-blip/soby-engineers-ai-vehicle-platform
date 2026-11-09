import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
} from "@mui/material";

import {
  Add,
  Edit,
  Delete,
  ArrowBack,
  Build,
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";


// ==========================================
// TYPES
// ==========================================

interface MaintenanceRecord {
  id: number;
  vehicle_id: number;
  vehicle_name: string;
  model: string;
  registration_number: string;

  service_type: string;
  service_date: string;
  next_service_date?: string | null;

  mileage_at_service?: number | null;
  cost?: number | null;

  service_center?: string | null;
  notes?: string | null;
}


// ==========================================
// COMPONENT
// ==========================================

const Maintenance: React.FC = () => {

  const navigate = useNavigate();

  const [records, setRecords] = useState<MaintenanceRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");


  // ==========================================
  // FETCH MAINTENANCE RECORDS
  // ==========================================

  const fetchMaintenance = async () => {

    try {

      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        "http://localhost:5000/api/maintenance",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to fetch maintenance records"
        );
      }

      setRecords(data);

    } catch (err: any) {

      console.error("Fetch Maintenance Error:", err);

      setError(
        err.message || "Unable to load maintenance records"
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // LOAD DATA
  // ==========================================

  useEffect(() => {
    fetchMaintenance();
  }, []);


  // ==========================================
  // DELETE MAINTENANCE
  // ==========================================

  const handleDelete = async (id: number) => {

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this maintenance record?"
    );

    if (!confirmDelete) {
      return;
    }

    try {

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/");
        return;
      }

      const response = await fetch(
        `http://localhost:5000/api/maintenance/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete maintenance record"
        );
      }

      setRecords((previousRecords) =>
        previousRecords.filter(
          (record) => record.id !== id
        )
      );

    } catch (err: any) {

      console.error("Delete Maintenance Error:", err);

      setError(
        err.message || "Failed to delete maintenance record"
      );

    }
  };


  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    date?: string | null
  ): string => {

    if (!date) {
      return "-";
    }

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return date;
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };


  // ==========================================
  // FORMAT COST
  // ==========================================

  const formatCost = (
    cost?: number | null
  ): string => {

    if (
      cost === null ||
      cost === undefined ||
      cost === 0
    ) {
      return "-";
    }

    return `₹${Number(cost).toLocaleString("en-IN")}`;
  };


  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#F5F7FA",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }


  // ==========================================
  // MAIN UI
  // ==========================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "#F5F7FA",
        padding: {
          xs: "20px",
          md: "35px",
        },
      }}
    >

      {/* ======================================
          HEADER
      ====================================== */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            md: "center",
          },
          flexDirection: {
            xs: "column",
            md: "row",
          },
          gap: 2,
          marginBottom: 4,
        }}
      >

        {/* LEFT SIDE */}

        <Box>

          {/* BACK BUTTON */}

          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate("/dashboard")}
            sx={{
              color: "#0F2747",
              textTransform: "none",
              fontWeight: 600,
              marginBottom: 1,
              "&:hover": {
                backgroundColor:
                  "rgba(15,39,71,0.08)",
              },
            }}
          >
            Back to Dashboard
          </Button>


          {/* TITLE */}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
            }}
          >

            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#0F2747",
                color: "#FFFFFF",
              }}
            >
              <Build />
            </Box>

            <Box>

              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  color: "#0F2747",
                }}
              >
                Maintenance
              </Typography>

              <Typography
                variant="body2"
                sx={{
                  color: "#64748B",
                  marginTop: 0.5,
                }}
              >
                Manage your vehicle maintenance records
              </Typography>

            </Box>

          </Box>

        </Box>


        {/* ADD BUTTON */}

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() =>
            navigate("/maintenance/add")
          }
          sx={{
            backgroundColor: "#1565C0",
            textTransform: "none",
            fontWeight: 600,
            padding: "10px 20px",
            borderRadius: "10px",
            "&:hover": {
              backgroundColor: "#0D47A1",
            },
          }}
        >
          Add Maintenance
        </Button>

      </Box>


      {/* ======================================
          ERROR MESSAGE
      ====================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            marginBottom: 3,
          }}
        >
          {error}
        </Alert>

      )}


      {/* ======================================
          EMPTY STATE
      ====================================== */}

      {records.length === 0 ? (

        <Paper
          elevation={0}
          sx={{
            padding: {
              xs: 4,
              md: 7,
            },
            textAlign: "center",
            borderRadius: "18px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
          }}
        >

          <Build
            sx={{
              fontSize: 55,
              color: "#94A3B8",
              marginBottom: 2,
            }}
          />

          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "#0F2747",
              marginBottom: 1,
            }}
          >
            No Maintenance Records
          </Typography>

          <Typography
            variant="body2"
            sx={{
              color: "#64748B",
              marginBottom: 3,
            }}
          >
            Add your first maintenance record to get started.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() =>
              navigate("/maintenance/add")
            }
            sx={{
              backgroundColor: "#1565C0",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: "10px",
              "&:hover": {
                backgroundColor: "#0D47A1",
              },
            }}
          >
            Add Maintenance
          </Button>

        </Paper>

      ) : (

        /* ======================================
           MAINTENANCE TABLE
        ====================================== */

        <Paper
          elevation={0}
          sx={{
            borderRadius: "18px",
            border: "1px solid #E2E8F0",
            backgroundColor: "#FFFFFF",
            overflow: "hidden",
          }}
        >

          {/* TABLE HEADER */}

          <Box
            sx={{
              display: "grid",
              gridTemplateColumns:
                "1.4fr 1.2fr 1fr 1fr 1fr 1fr 120px",
              gap: 2,
              padding: "18px 24px",
              backgroundColor: "#F8FAFC",
              borderBottom:
                "1px solid #E2E8F0",
              minWidth: "1050px",
            }}
          >

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Vehicle
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Service Type
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Service Date
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Next Service
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Mileage
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
              }}
            >
              Cost
            </Typography>

            <Typography
              sx={{
                fontWeight: 700,
                color: "#475569",
                fontSize: "14px",
                textAlign: "center",
              }}
            >
              Actions
            </Typography>

          </Box>


          {/* TABLE BODY */}

          <Box
            sx={{
              overflowX: "auto",
            }}
          >

            {records.map((record) => (

              <Box
                key={record.id}
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "1.4fr 1.2fr 1fr 1fr 1fr 1fr 120px",
                  gap: 2,
                  alignItems: "center",
                  padding: "20px 24px",
                  minWidth: "1050px",
                  borderBottom:
                    "1px solid #E2E8F0",
                  "&:hover": {
                    backgroundColor: "#F8FAFC",
                  },
                }}
              >

                {/* VEHICLE */}

                <Box>

                  <Typography
                    sx={{
                      fontWeight: 700,
                      color: "#0F2747",
                      fontSize: "15px",
                    }}
                  >
                    {record.vehicle_name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: "12px",
                      color: "#64748B",
                      marginTop: 0.5,
                    }}
                  >
                    {record.model}
                  </Typography>

                  <Chip
                    label={
                      record.registration_number
                    }
                    size="small"
                    sx={{
                      marginTop: 1,
                      backgroundColor:
                        "#EFF6FF",
                      color: "#1565C0",
                      fontWeight: 600,
                      fontSize: "11px",
                    }}
                  />

                </Box>


                {/* SERVICE TYPE */}

                <Typography
                  sx={{
                    color: "#334155",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {record.service_type}
                </Typography>


                {/* SERVICE DATE */}

                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  {formatDate(
                    record.service_date
                  )}
                </Typography>


                {/* NEXT SERVICE */}

                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  {formatDate(
                    record.next_service_date
                  )}
                </Typography>


                {/* MILEAGE */}

                <Typography
                  sx={{
                    color: "#475569",
                    fontSize: "14px",
                  }}
                >
                  {record.mileage_at_service
                    ? `${Number(
                        record.mileage_at_service
                      ).toLocaleString(
                        "en-IN"
                      )} km`
                    : "-"}
                </Typography>


                {/* COST */}

                <Typography
                  sx={{
                    color: "#0F2747",
                    fontWeight: 600,
                    fontSize: "14px",
                  }}
                >
                  {formatCost(record.cost)}
                </Typography>


                {/* ACTIONS */}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent:
                      "center",
                    gap: 0.5,
                  }}
                >

                  {/* EDIT */}

                  <IconButton
                    onClick={() =>
                      navigate(
                        "/maintenance/edit",
                        {
                          state: {
                            maintenance:
                              record,
                          },
                        }
                      )
                    }
                    sx={{
                      color: "#1565C0",
                      "&:hover": {
                        backgroundColor:
                          "rgba(21,101,192,0.08)",
                      },
                    }}
                  >
                    <Edit />
                  </IconButton>


                  {/* DELETE */}

                  <IconButton
                    onClick={() =>
                      handleDelete(record.id)
                    }
                    sx={{
                      color: "#D32F2F",
                      "&:hover": {
                        backgroundColor:
                          "rgba(211,47,47,0.08)",
                      },
                    }}
                  >
                    <Delete />
                  </IconButton>

                </Box>

              </Box>

            ))}

          </Box>

        </Paper>

      )}

    </Box>
  );
};

export default Maintenance;