import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  Box,
  Paper,
  Typography,
} from "@mui/material";

import {
  ArrowBackRounded,
  DirectionsCarRounded,
  SaveRounded,
  AutoAwesomeRounded,
  LocalGasStationRounded,
  SpeedRounded,
  BuildRounded,
  CalendarMonthRounded,
  LocationOnRounded,
} from "@mui/icons-material";

import "./AddVehicle.css";

const AddVehicle: React.FC = () => {
  const navigate = useNavigate();

  const [vehicle, setVehicle] = useState({
    registrationNumber: "",
    brand: "",
    model: "",
    year: "",
    fuelType: "",
    mileage: "",
    engineType: "",
    vehicleUsage: "",
    odometer: "",
    location: "",
  });

  // =========================================================
  // HANDLE INPUT CHANGE
  // =========================================================

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setVehicle((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // =========================================================
  // HANDLE FORM SUBMIT
  // =========================================================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Please login first.");
        navigate("/");
        return;
      }

      // Data sent to Node.js backend
      const vehicleData = {
        vehicle_name: vehicle.brand,
        model: vehicle.model,
        registration_number: vehicle.registrationNumber,
        manufacturer: vehicle.brand,
        fuel_type: vehicle.fuelType,

        purchase_date: `${vehicle.year}-01-01`,

        mileage: Number(vehicle.odometer),

        engine_type: vehicle.engineType,
        vehicle_usage: vehicle.vehicleUsage,
      };

      console.log("Sending Vehicle Data:", vehicleData);

      const response = await axios.post(
        "http://localhost:5000/api/vehicles/add",
        vehicleData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Server Response:", response.data);

      alert("Vehicle added successfully!");

      navigate("/vehicles");

    } catch (error: any) {
      console.error("Add Vehicle Error:", error);

      if (error.response) {
        alert(
          error.response.data?.message ||
          "Failed to add vehicle"
        );
      } else {
        alert("Unable to connect to the server.");
      }
    }
  };

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <Box className="add-vehicle-page">

      {/* =====================================================
          HEADER
      ===================================================== */}

      <header className="av-header">

        <Box className="av-logo-area">

          <Box className="av-logo-icon">
            <DirectionsCarRounded />
          </Box>

          <Box className="av-logo-text">
            <Typography component="h2">
              AI Vehicle Platform
            </Typography>

            <Typography component="span">
              SMART VEHICLE INTELLIGENCE
            </Typography>
          </Box>

        </Box>

        {/* NAVIGATION */}

        <nav className="av-navigation">

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            type="button"
            className="av-active-nav"
          >
            Vehicles
          </button>

          <button
            type="button"
          >
            Maintenance
          </button>

          <button
            type="button"
          >
            Reports
          </button>

        </nav>

        {/* BACK BUTTON */}

        <button
          type="button"
          className="av-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <ArrowBackRounded />
          <span>Back</span>
        </button>

      </header>


      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="av-hero">

        <Box className="av-hero-content">

          <Box className="av-breadcrumb">
            VEHICLE MANAGEMENT
            <span>/</span>
            ADD VEHICLE
          </Box>

          <Typography component="h1">
            Add a new <span>vehicle</span>
          </Typography>

          <Typography component="p">
            Enter your vehicle information to start
            monitoring its health and generating AI-powered
            predictive maintenance insights.
          </Typography>

          <Box className="av-hero-line" />

          <Box className="av-hero-feature">

            <Box>
              <strong>AI MONITORING</strong>
              <span>
                Intelligent vehicle analysis
              </span>
            </Box>

            <Box>
              <strong>PREDICTIVE MAINTENANCE</strong>
              <span>
                Prevent unexpected failures
              </span>
            </Box>

          </Box>

        </Box>

      </section>


      {/* =====================================================
          MAIN
      ===================================================== */}

      <main className="av-main">

        {/* PAGE HEADING */}

        <Box className="av-page-heading">

          <Box>

            <Typography className="av-small-label">
              VEHICLE REGISTRATION
            </Typography>

            <Typography component="h2">
              Vehicle Information
            </Typography>

            <Typography component="p">
              Provide accurate vehicle details for better
              health monitoring and predictive maintenance.
            </Typography>

          </Box>

          {/* STEP INDICATOR */}

          <Box className="av-step-indicator">

            <span className="av-step-active">
              01
            </span>

            <Box />

            <span>
              02
            </span>

            <Box />

            <span>
              03
            </span>

          </Box>

        </Box>


        {/* =================================================
            FORM
        ================================================= */}

        <Paper
          component="form"
          onSubmit={handleSubmit}
          className="av-form"
          elevation={0}
        >

          {/* =================================================
              BASIC INFORMATION
          ================================================= */}

          <section className="av-form-section">

            <Box className="av-section-title">

              <Box className="av-section-number">
                01
              </Box>

              <Box>

                <Typography component="h3">
                  Basic Information
                </Typography>

                <Typography component="p">
                  Enter the basic details of your vehicle.
                </Typography>

              </Box>

            </Box>


            <Box className="av-grid">

              {/* REGISTRATION NUMBER */}

              <Box className="av-field">

                <label>
                  Registration Number <span>*</span>
                </label>

                <Box className="av-input">

                  <DirectionsCarRounded />

                  <input
                    type="text"
                    name="registrationNumber"
                    placeholder="e.g. TN 01 AB 1234"
                    value={vehicle.registrationNumber}
                    onChange={handleChange}
                    required
                  />

                </Box>

              </Box>


              {/* VEHICLE BRAND */}

              <Box className="av-field">

                <label>
                  Vehicle Brand <span>*</span>
                </label>

                <Box className="av-input">

                  <BuildRounded />

                  <input
                    type="text"
                    name="brand"
                    placeholder="e.g. Maruti Suzuki"
                    value={vehicle.brand}
                    onChange={handleChange}
                    required
                  />

                </Box>

              </Box>


              {/* VEHICLE MODEL */}

              <Box className="av-field">

                <label>
                  Vehicle Model <span>*</span>
                </label>

                <Box className="av-input">

                  <DirectionsCarRounded />

                  <input
                    type="text"
                    name="model"
                    placeholder="e.g. Swift ZXI"
                    value={vehicle.model}
                    onChange={handleChange}
                    required
                  />

                </Box>

              </Box>


              {/* MANUFACTURING YEAR */}

              <Box className="av-field">

                <label>
                  Manufacturing Year <span>*</span>
                </label>

                <Box className="av-input">

                  <CalendarMonthRounded />

                  <input
                    type="number"
                    name="year"
                    placeholder="e.g. 2022"
                    min="1990"
                    max="2026"
                    value={vehicle.year}
                    onChange={handleChange}
                    required
                  />

                </Box>

              </Box>

            </Box>

          </section>


          {/* =================================================
              VEHICLE SPECIFICATIONS
          ================================================= */}

          <section className="av-form-section">

            <Box className="av-section-title">

              <Box className="av-section-number">
                02
              </Box>

              <Box>

                <Typography component="h3">
                  Vehicle Specifications
                </Typography>

                <Typography component="p">
                  Add technical information used by the AI system.
                </Typography>

              </Box>

            </Box>


            <Box className="av-grid">

              {/* FUEL TYPE */}

              <Box className="av-field">

                <label>
                  Fuel Type <span>*</span>
                </label>

                <Box className="av-input">

                  <LocalGasStationRounded />

                  <select
                    name="fuelType"
                    value={vehicle.fuelType}
                    onChange={handleChange}
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select fuel type
                    </option>

                    <option value="Petrol">
                      Petrol
                    </option>

                    <option value="Diesel">
                      Diesel
                    </option>

                    <option value="Electric">
                      Electric
                    </option>

                    <option value="Hybrid">
                      Hybrid
                    </option>

                  </select>

                </Box>

              </Box>


              {/* CURRENT MILEAGE */}

              <Box className="av-field">

                <label>
                  Current Mileage <span>*</span>
                </label>

                <Box className="av-input">

                  <SpeedRounded />

                  <input
                    type="number"
                    name="mileage"
                    placeholder="e.g. 18"
                    value={vehicle.mileage}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    KM/L
                  </small>

                </Box>

              </Box>


              {/* ENGINE TYPE */}

              <Box className="av-field">

                <label>
                  Engine Type <span>*</span>
                </label>

                <Box className="av-input">

                  <BuildRounded />

                  <select
                    name="engineType"
                    value={vehicle.engineType}
                    onChange={handleChange}
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select engine type
                    </option>

                    <option value="Small">
                      Small
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="Large">
                      Large
                    </option>

                  </select>

                </Box>

              </Box>


              {/* VEHICLE USAGE */}

              <Box className="av-field">

                <label>
                  Vehicle Usage <span>*</span>
                </label>

                <Box className="av-input">

                  <DirectionsCarRounded />

                  <select
                    name="vehicleUsage"
                    value={vehicle.vehicleUsage}
                    onChange={handleChange}
                    required
                  >

                    <option
                      value=""
                      disabled
                    >
                      Select usage
                    </option>

                    <option value="Low">
                      Low
                    </option>

                    <option value="Medium">
                      Medium
                    </option>

                    <option value="High">
                      High
                    </option>

                  </select>

                </Box>

              </Box>


              {/* ODOMETER */}

              <Box className="av-field">

                <label>
                  Current Odometer <span>*</span>
                </label>

                <Box className="av-input">

                  <SpeedRounded />

                  <input
                    type="number"
                    name="odometer"
                    placeholder="e.g. 25000"
                    value={vehicle.odometer}
                    onChange={handleChange}
                    required
                  />

                  <small>
                    KM
                  </small>

                </Box>

              </Box>


              {/* LOCATION */}

              <Box className="av-field av-full">

                <label>
                  Current Location
                </label>

                <Box className="av-input">

                  <LocationOnRounded />

                  <input
                    type="text"
                    name="location"
                    placeholder="e.g. Kochi, Kerala"
                    value={vehicle.location}
                    onChange={handleChange}
                  />

                </Box>

              </Box>

            </Box>

          </section>


          {/* =================================================
              AI INFORMATION
          ================================================= */}

          <Box className="av-ai-box">

            <Box className="av-ai-symbol">
              <AutoAwesomeRounded />
            </Box>

            <Box className="av-ai-content">

              <Typography component="h4">
                AI-Powered Vehicle Intelligence
              </Typography>

              <Typography component="p">
                Once your vehicle is registered, the platform
                will analyze vehicle information and maintenance
                data to calculate vehicle health and generate
                predictive maintenance insights.
              </Typography>

            </Box>

          </Box>


          {/* =================================================
              FORM ACTIONS
          ================================================= */}

          <Box className="av-actions">

            <button
              type="button"
              className="av-cancel"
              onClick={() => navigate("/vehicles")}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="av-submit"
            >
              <SaveRounded />
              Save Vehicle
            </button>

          </Box>

        </Paper>

      </main>


      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="av-footer">

        <span>
          © 2026 AI Vehicle Platform
        </span>

        <span>
          SMART • PREDICTIVE • INTELLIGENT
        </span>

      </footer>

    </Box>
  );
};

export default AddVehicle;