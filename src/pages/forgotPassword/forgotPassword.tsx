import { useState } from "react";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import { forgotPassword } from "../../services/authService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
  CircularProgress,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockResetRoundedIcon from "@mui/icons-material/LockResetRounded";

import backgroundImage from "../../assets/images/login-bg.png";
import logo from "../../assets/images/logo.png";


const ForgotPassword = () => {

  const navigate = useNavigate();


  // =========================
  // STATES
  // =========================

  const [email, setEmail] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");


  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = async () => {

    console.log("Forgot Password Button Clicked");

    console.log(
      "Email:",
      email
    );


    // -------------------------
    // Validate email
    // -------------------------

    if (!email.trim()) {

      setError(
        "Please enter your email address."
      );

      return;
    }


    // Basic email validation

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email.trim())) {

      setError(
        "Please enter a valid email address."
      );

      return;
    }


    try {

      setLoading(true);

      setError("");


      // -------------------------
      // Verify email
      // -------------------------

      const response =
        await forgotPassword(
          email.trim()
        );


      console.log(
        "Forgot Password API Response:",
        response
      );


      // -------------------------
      // Save email
      // -------------------------

      localStorage.setItem(
        "resetEmail",
        email.trim()
      );


      console.log(
        "Saved resetEmail:",
        localStorage.getItem(
          "resetEmail"
        )
      );


      // -------------------------
      // Navigate to reset page
      // -------------------------

      navigate(
        "/reset-password",
        {
          state: {
            email: email.trim(),
          },
        }
      );


    } catch (err: any) {

      console.error(
        "Forgot Password Error:",
        err
      );


      const message =
        err?.response?.data?.message ||
        err?.message ||
        "Unable to verify email.";


      setError(message);


    } finally {

      setLoading(false);

    }

  };


  // =========================
  // UI
  // =========================

  return (

    <Box
      sx={{
        width: "100%",
        height: "100vh",

        backgroundImage:
          `url(${backgroundImage})`,

        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",

        position: "relative",
      }}
    >

      {/* =========================
          DARK OVERLAY
      ========================= */}

      <Box
        sx={{
          position: "absolute",

          inset: 0,

          background:
            "linear-gradient(rgba(8,20,45,.65), rgba(0,0,0,.72))",
        }}
      />


      {/* =========================
          MAIN CONTAINER
      ========================= */}

      <Box
        sx={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent: "center",

          alignItems: "center",

          height: "100%",

          p: 2,
        }}
      >


        {/* =========================
            CARD
        ========================= */}

        <Paper
          elevation={0}
          sx={{
            width: 500,

            maxWidth: "100%",

            p: 5,

            borderRadius: "28px",

            background:
              "rgba(255,255,255,.12)",

            backdropFilter:
              "blur(20px)",

            WebkitBackdropFilter:
              "blur(20px)",

            border:
              "1px solid rgba(255,255,255,.18)",

            boxShadow:
              "0 25px 60px rgba(0,0,0,.45)",
          }}
        >


          {/* =========================
              LOGO
          ========================= */}

          <Box
            sx={{
              display: "flex",

              justifyContent:
                "center",

              mb: 2,
            }}
          >

            <Box
              component="img"

              src={logo}

              alt="AI Vehicle Logo"

              sx={{
                width: 110,

                height: "auto",
              }}
            />

          </Box>


          {/* =========================
              LOCK RESET ICON
          ========================= */}

          <Box
            sx={{
              display: "flex",

              justifyContent:
                "center",

              mb: 2,
            }}
          >

            <Box
              sx={{
                width: 80,

                height: 80,

                borderRadius: "50%",

                display: "flex",

                justifyContent:
                  "center",

                alignItems:
                  "center",

                background:
                  "linear-gradient(135deg,#2563EB,#3B82F6)",

                boxShadow:
                  "0 10px 35px rgba(37,99,235,.45)",
              }}
            >

              <LockResetRoundedIcon
                sx={{
                  color: "#fff",

                  fontSize: 42,
                }}
              />

            </Box>

          </Box>


          {/* =========================
              TITLE
          ========================= */}

          <Typography
            variant="h4"
            sx={{
              textAlign: "center",

              color: "#fff",

              fontWeight: 700,
            }}
          >
            Forgot Password
          </Typography>


          {/* =========================
              DESCRIPTION
          ========================= */}

          <Typography
            sx={{
              color: "#D1D5DB",

              textAlign: "center",

              mt: 1,

              mb: 4,

              lineHeight: 1.6,
            }}
          >
            Enter your registered email address.
            <br />
            We'll verify your account before allowing
            you to reset your password.
          </Typography>


          {/* =========================
              EMAIL FIELD
          ========================= */}

          <TextField
            fullWidth

            label="Email Address"

            type="email"

            value={email}

            onChange={(e) => {

              setEmail(
                e.target.value
              );

              setError("");

            }}

            onKeyDown={(e) => {

              if (e.key === "Enter") {

                handleSubmit();

              }

            }}

            error={!!error}

            helperText={error}

            disabled={loading}


            // IMPORTANT:
            // New MUI API
            // Do NOT use InputProps

            slotProps={{
              input: {

                startAdornment: (

                  <InputAdornment
                    position="start"
                  >

                    <EmailOutlinedIcon
                      sx={{
                        color:
                          "#90CAF9",
                      }}
                    />

                  </InputAdornment>

                ),

              },
            }}


            sx={{

              "& .MuiOutlinedInput-root": {

                color: "#fff",

                borderRadius: "16px",

                background:
                  "rgba(255,255,255,.08)",


                "& fieldset": {

                  borderColor:
                    "rgba(255,255,255,.25)",

                },


                "&:hover fieldset": {

                  borderColor:
                    "#42A5F5",

                },


                "&.Mui-focused fieldset": {

                  borderColor:
                    "#42A5F5",

                },

              },


              "& .MuiInputLabel-root": {

                color: "#ddd",

              },


              "& .MuiInputLabel-root.Mui-focused": {

                color:
                  "#42A5F5",

              },


              "& .MuiFormHelperText-root": {

                color:
                  "#FFB4B4",

              },

            }}
          />


          {/* =========================
              CONTINUE BUTTON
          ========================= */}

          <Button
            fullWidth

            variant="contained"

            onClick={handleSubmit}

            disabled={loading}

            sx={{

              mt: 4,

              height: 58,

              borderRadius: "15px",

              fontWeight: 700,

              fontSize: 17,

              textTransform:
                "none",

              background:
                "linear-gradient(135deg,#2563EB,#3B82F6)",

              boxShadow:
                "0 15px 35px rgba(37,99,235,.45)",


              "&:hover": {

                background:
                  "linear-gradient(135deg,#1D4ED8,#2563EB)",

              },


              "&:disabled": {

                background:
                  "linear-gradient(135deg,#1E40AF,#2563EB)",

                color: "#fff",

              },

            }}
          >

            {loading ? (

              <CircularProgress
                size={25}
                sx={{
                  color: "#fff",
                }}
              />

            ) : (

              "Continue"

            )}

          </Button>


          {/* =========================
              BACK TO LOGIN
          ========================= */}

          <Typography
            sx={{
              textAlign: "center",

              mt: 3,

              color: "#D1D5DB",
            }}
          >

            Remember your password?{" "}

            <Link
              component={RouterLink}

              to="/"

              underline="hover"

              sx={{
                color: "#42A5F5",

                fontWeight: 600,
              }}
            >
              Back to Login
            </Link>

          </Typography>


          {/* =========================
              FOOTER
          ========================= */}

          <Typography
            sx={{
              mt: 4,

              textAlign: "center",

              color: "#9CA3AF",

              fontSize: 13,
            }}
          >
            🔒 Your account is protected with secure
            authentication.
          </Typography>


        </Paper>

      </Box>

    </Box>

  );

};


export default ForgotPassword;