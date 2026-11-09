import React, { useEffect, useState } from "react";

import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Alert,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";

import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import PsychologyIcon from "@mui/icons-material/Psychology";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import WarningIcon from "@mui/icons-material/Warning";
import SaveIcon from "@mui/icons-material/Save";
import HistoryIcon from "@mui/icons-material/History";

import { useNavigate } from "react-router-dom";

import "./ImageAI.css";

// ==========================================
// VEHICLE TYPE
// ==========================================

interface Vehicle {
  id: number;
  vehicle_name: string;
  registration_number: string;
  model?: string;
  manufacturer?: string;
}

// ==========================================
// PREDICTION RESULT TYPE
// ==========================================

interface PredictionResult {
  success: boolean;
  prediction: string;
  confidence: number;
  recommendation: string;
}

// ==========================================
// IMAGE AI COMPONENT
// ==========================================

const ImageAI: React.FC = () => {

  const navigate = useNavigate();

  // ==========================================
  // STATE
  // ==========================================

  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  const [selectedVehicleId, setSelectedVehicleId] =
    useState<number | "">("");

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [preview, setPreview] =
    useState<string | null>(null);

  const [result, setResult] =
    useState<PredictionResult | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [saving, setSaving] =
    useState(false);

  const [loadingVehicles, setLoadingVehicles] =
    useState(false);

  const [error, setError] =
    useState("");

  const [saveSuccess, setSaveSuccess] =
    useState(false);


  // ==========================================
  // LOAD USER VEHICLES
  // ==========================================

  useEffect(() => {

    const fetchVehicles = async () => {

      setLoadingVehicles(true);

      try {

        const token =
          localStorage.getItem("token");

        if (!token) {
          throw new Error(
            "Authentication token not found. Please login again."
          );
        }

        const response = await fetch(
          "http://localhost:5000/api/vehicles",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${token}`,
            },
          }
        );

        const data =
          await response.json();

        if (!response.ok) {

          throw new Error(
            data.message ||
            "Failed to load vehicles."
          );
        }

        const vehicleList =
          Array.isArray(data)
            ? data
            : data.vehicles || [];

        setVehicles(vehicleList);

      } catch (error: any) {

        console.error(
          "Vehicle Loading Error:",
          error
        );

        setError(
          error.message ||
          "Unable to load vehicles."
        );

      } finally {

        setLoadingVehicles(false);

      }
    };

    fetchVehicles();

  }, []);


  // ==========================================
  // SELECT VEHICLE
  // ==========================================

  const handleVehicleChange = (
    event: any
  ) => {

    setSelectedVehicleId(
      event.target.value
    );

    setSaveSuccess(false);
    setError("");
    setResult(null);
  };


  // ==========================================
  // SELECT IMAGE
  // ==========================================

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {

      setError(
        "Please select a JPG, JPEG or PNG image."
      );

      return;
    }

    // Maximum 10 MB

    if (file.size > 10 * 1024 * 1024) {

      setError(
        "Image size must be less than 10 MB."
      );

      return;
    }

    // Release previous object URL

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    const imagePreview =
      URL.createObjectURL(file);

    setSelectedImage(file);

    setPreview(imagePreview);

    setResult(null);

    setError("");

    setSaveSuccess(false);

  };


  // ==========================================
  // ANALYZE IMAGE
  // ==========================================

  const analyzeImage = async () => {

    // Vehicle validation

    if (!selectedVehicleId) {

      setError(
        "Please select a vehicle before analyzing the image."
      );

      return;
    }

    // Image validation

    if (!selectedImage) {

      setError(
        "Please select a vehicle image first."
      );

      return;
    }

    setLoading(true);

    setError("");

    setResult(null);

    setSaveSuccess(false);

    try {

      // ==========================================
      // SEND IMAGE TO PYTHON AI
      // ==========================================

      const formData =
        new FormData();

      formData.append(
        "image",
        selectedImage
      );

      const response =
        await fetch(
          "http://localhost:8000/image-predict",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.error ||
          "Image analysis failed."
        );
      }

      // ==========================================
      // DISPLAY RESULT
      // ==========================================

      setResult(data);

    } catch (error: any) {

      console.error(
        "Image AI Error:",
        error
      );

      setError(
        error.message ||
        "Unable to connect to the Image AI service."
      );

    } finally {

      setLoading(false);

    }
  };


  // ==========================================
  // SAVE ANALYSIS
  // ==========================================

  const saveAnalysis = async () => {

    if (!selectedVehicleId) {

      setError(
        "Please select a vehicle before saving the analysis."
      );

      return;
    }

    if (!result) {

      setError(
        "Please analyze the image before saving."
      );

      return;
    }

    if (!selectedImage) {

      setError(
        "Selected image not found."
      );

      return;
    }

    setSaving(true);

    setError("");

    setSaveSuccess(false);

    try {

      // ==========================================
      // GET JWT TOKEN
      // ==========================================

      const token =
        localStorage.getItem("token");

      if (!token) {

        throw new Error(
          "Authentication token not found. Please login again."
        );
      }

      // ==========================================
      // SEND RESULT TO NODE BACKEND
      // ==========================================

      const response =
        await fetch(
          "http://localhost:5000/api/image-predictions",
          {
            method: "POST",

            headers: {

              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,

            },

            body: JSON.stringify({

              vehicle_id:
                selectedVehicleId,

              image_name:
                selectedImage.name,

              prediction:
                result.prediction,

              confidence:
                result.confidence,

              recommendation:
                result.recommendation,

            }),

          }
        );

      // ==========================================
      // READ RESPONSE
      // ==========================================

      const data =
        await response.json();

      // ==========================================
      // CHECK RESPONSE
      // ==========================================

      if (
        !response.ok ||
        !data.success
      ) {

        throw new Error(
          data.message ||
          data.error ||
          "Failed to save image analysis."
        );
      }

      // ==========================================
      // SAVE SUCCESS
      // ==========================================

      setSaveSuccess(true);

      console.log(
        "Image analysis saved successfully:",
        data
      );

    } catch (error: any) {

      console.error(
        "Save Image Analysis Error:",
        error
      );

      setError(
        error.message ||
        "Unable to save image analysis."
      );

    } finally {

      setSaving(false);

    }
  };


  // ==========================================
  // RESET
  // ==========================================

  const resetAnalysis = () => {

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedImage(null);

    setPreview(null);

    setResult(null);

    setError("");

    setSaveSuccess(false);

  };


  // ==========================================
  // GET SELECTED VEHICLE
  // ==========================================

  const selectedVehicle =
    vehicles.find(
      (vehicle) =>
        vehicle.id === selectedVehicleId
    );


  // ==========================================
  // UI
  // ==========================================

  return (

    <Box className="image-ai-page">

      {/* =====================================
          HEADER
      ====================================== */}

      <Box className="image-ai-header">

        <Box>

          <Typography className="image-ai-title">
            AI Vehicle Image Analysis
          </Typography>

          <Typography className="image-ai-subtitle">
            Upload a vehicle image and let AI
            analyze its visible condition.
          </Typography>

        </Box>

        <Box className="ai-header-icon">

          <PsychologyIcon />

        </Box>

      </Box>


      {/* =====================================
          MAIN CONTENT
      ====================================== */}

      <Box className="image-ai-content">


        {/* =====================================
            UPLOAD CARD
        ====================================== */}

        <Card className="image-upload-card">

          <CardContent>

            <Typography className="section-title">
              Vehicle & Image
            </Typography>

            <Typography className="section-description">
              Select a vehicle and upload a clear
              image for AI-based condition analysis.
            </Typography>


            {/* =================================
                VEHICLE SELECTION
            ================================== */}

            <FormControl
              fullWidth
              sx={{ mb: 3 }}
            >

              <InputLabel id="vehicle-select-label">
                Select Vehicle
              </InputLabel>

              <Select
                labelId="vehicle-select-label"
                value={selectedVehicleId}
                label="Select Vehicle"
                onChange={handleVehicleChange}
                disabled={
                  loadingVehicles ||
                  loading ||
                  saving
                }
              >

                <MenuItem value="">
                  <em>
                    Select a vehicle
                  </em>
                </MenuItem>


                {vehicles.map(
                  (vehicle) => (

                    <MenuItem
                      key={vehicle.id}
                      value={vehicle.id}
                    >

                      {vehicle.vehicle_name}
                      {" - "}
                      {vehicle.registration_number}

                    </MenuItem>

                  )
                )}

              </Select>

            </FormControl>


            {/* =================================
                NO VEHICLES
            ================================== */}

            {!loadingVehicles &&
              vehicles.length === 0 && (

                <Alert
                  severity="warning"
                  className="image-alert"
                >
                  No vehicles found. Please add
                  a vehicle before using Image AI.
                </Alert>

              )}


            {/* =================================
                UPLOAD AREA
            ================================== */}

            {!preview && (

              <label
                htmlFor="vehicle-image-upload"
              >

                <Box className="upload-area">

                  <CloudUploadIcon
                    className="upload-icon"
                  />

                  <Typography className="upload-title">
                    Choose Vehicle Image
                  </Typography>

                  <Typography className="upload-text">
                    JPG, JPEG or PNG
                  </Typography>

                  <Button
                    variant="contained"
                    component="span"
                    className="upload-button"
                    disabled={
                      !selectedVehicleId ||
                      loadingVehicles
                    }
                  >
                    Select Image
                  </Button>

                </Box>

              </label>

            )}


            {/* =================================
                FILE INPUT
            ================================== */}

            <input
              id="vehicle-image-upload"
              type="file"
              accept="image/png,image/jpeg,image/jpg"
              hidden
              onChange={handleImageChange}
            />


            {/* =================================
                IMAGE PREVIEW
            ================================== */}

            {preview && (

              <Box className="preview-section">

                <Typography className="preview-title">
                  Selected Vehicle Image
                </Typography>


                <Box className="image-preview-container">

                  <img
                    src={preview}
                    alt="Vehicle Preview"
                    className="vehicle-preview"
                  />

                </Box>


                {/* =================================
                    ACTION BUTTONS
                ================================== */}

                <Box className="action-buttons">

                  <Button
                    variant="contained"
                    className="analyze-button"
                    onClick={analyzeImage}
                    disabled={
                      loading ||
                      saving
                    }
                  >

                    <PsychologyIcon />

                    {loading
                      ? "Analyzing..."
                      : "Analyze Image"}

                  </Button>


                  <Button
                    variant="outlined"
                    className="reset-button"
                    onClick={resetAnalysis}
                    disabled={
                      loading ||
                      saving
                    }
                  >

                    Reset

                  </Button>


                  {/* =================================
                      VIEW HISTORY BUTTON
                  ================================== */}

                  <Button
                    variant="outlined"
                    className="history-button"
                    startIcon={
                      <HistoryIcon />
                    }
                    onClick={() =>
                      navigate("/image-ai-history")
                    }
                    disabled={
                      loading ||
                      saving
                    }
                  >

                    View History

                  </Button>

                </Box>


                {/* =================================
                    PROGRESS
                ================================== */}

                {loading && (

                  <Box className="progress-container">

                    <LinearProgress />

                    <Typography>
                      AI is analyzing the vehicle
                      image...
                    </Typography>

                  </Box>

                )}

              </Box>

            )}


            {/* =================================
                ERROR
            ================================== */}

            {error && (

              <Alert
                severity="error"
                className="image-alert"
              >

                {error}

              </Alert>

            )}


            {/* =================================
                SAVE SUCCESS
            ================================== */}

            {saveSuccess && (

              <Alert
                severity="success"
                className="image-alert"
              >

                Image analysis saved successfully
                for the selected vehicle.

              </Alert>

            )}

          </CardContent>

        </Card>


        {/* =====================================
            RESULT CARD
        ====================================== */}

        {result && (

          <Card className="result-card">

            <CardContent>

              <Typography className="section-title">
                AI Analysis Result
              </Typography>


              {/* =================================
                  SELECTED VEHICLE
              ================================== */}

              <Box
                sx={{
                  marginBottom: "20px",
                  padding: "14px 16px",
                  borderRadius: "12px",
                  background: "#f8fafc",
                }}
              >

                <Typography
                  sx={{
                    fontSize: "12px",
                    fontWeight: 600,
                    color: "#64748b",
                    marginBottom: "4px",
                  }}
                >
                  Analyzed Vehicle
                </Typography>

                <Typography
                  sx={{
                    fontSize: "15px",
                    fontWeight: 700,
                    color: "#1e293b",
                  }}
                >

                  {selectedVehicle?.vehicle_name}
                  {" - "}
                  {selectedVehicle?.registration_number}

                </Typography>

              </Box>


              {/* =================================
                  VEHICLE CONDITION
              ================================== */}

              <Box className="result-status">

                {result.prediction === "Normal" ? (

                  <CheckCircleIcon
                    className="normal-icon"
                  />

                ) : (

                  <WarningIcon
                    className="damaged-icon"
                  />

                )}


                <Typography className="condition-label">
                  Vehicle Condition
                </Typography>


                <Chip
                  label={result.prediction}
                  className={
                    result.prediction === "Normal"
                      ? "normal-chip"
                      : "damaged-chip"
                  }
                />

              </Box>


              {/* =================================
                  CONFIDENCE
              ================================== */}

              <Box className="confidence-section">

                <Box className="confidence-header">

                  <Typography>
                    AI Confidence
                  </Typography>

                  <Typography className="confidence-value">
                    {result.confidence}%
                  </Typography>

                </Box>


                <LinearProgress
                  variant="determinate"
                  value={result.confidence}
                  className="confidence-bar"
                />

              </Box>


              {/* =================================
                  RECOMMENDATION
              ================================== */}

              <Box className="recommendation-box">

                <Typography className="recommendation-title">
                  AI Recommendation
                </Typography>

                <Typography className="recommendation-text">
                  {result.recommendation}
                </Typography>

              </Box>


              {/* =================================
                  SAVE ANALYSIS BUTTON
              ================================== */}

              {!saveSuccess && (

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    <SaveIcon />
                  }
                  className="save-analysis-button"
                  onClick={saveAnalysis}
                  disabled={saving}
                >

                  {saving
                    ? "Saving Analysis..."
                    : "Save Analysis"}

                </Button>

              )}


              {/* =================================
                  HISTORY AFTER SAVE
              ================================== */}

              {saveSuccess && (

                <Button
                  variant="contained"
                  fullWidth
                  startIcon={
                    <HistoryIcon />
                  }
                  className="save-analysis-button"
                  onClick={() =>
                    navigate("/image-ai-history")
                  }
                >

                  View Saved Analysis History

                </Button>

              )}

            </CardContent>

          </Card>

        )}

      </Box>

    </Box>

  );
};

export default ImageAI;