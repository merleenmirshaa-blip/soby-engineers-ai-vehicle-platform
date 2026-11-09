import { useState } from "react";

import {
  Link as RouterLink,
  useNavigate,
} from "react-router-dom";

import { loginUser } from "../../services/authService";

import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  InputAdornment,
  IconButton,
  CircularProgress,
} from "@mui/material";

import {
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import LoginRoundedIcon from "@mui/icons-material/LoginRounded";

import backgroundImage from "../../assets/images/login-bg.png";
import logo from "../../assets/images/logo.png";


const Login = () => {

  const navigate = useNavigate();


  // =========================
  // STATES
  // =========================

  const [showPassword, setShowPassword] =
    useState(false);

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [emailError, setEmailError] =
    useState("");

  const [passwordError, setPasswordError] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [rememberMe, setRememberMe] =
    useState(false);


  // =========================
  // VALIDATION
  // =========================

  const validate = () => {

    let valid = true;

    const trimmedEmail =
      email.trim();


    // -------------------------
    // Email validation
    // -------------------------

    if (!trimmedEmail) {

      setEmailError(
        "Email address is required"
      );

      valid = false;

    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        trimmedEmail
      )
    ) {

      setEmailError(
        "Please enter a valid email address"
      );

      valid = false;

    } else {

      setEmailError("");

    }


    // -------------------------
    // Password validation
    // -------------------------

    if (!password) {

      setPasswordError(
        "Password is required"
      );

      valid = false;

    } else if (
      password.length < 6
    ) {

      setPasswordError(
        "Password must be at least 6 characters"
      );

      valid = false;

    } else {

      setPasswordError("");

    }


    return valid;
  };


  // =========================
  // LOGIN
  // =========================

  const handleLogin = async () => {

    console.log(
      "========== LOGIN =========="
    );

    console.log(
      "Email:",
      email
    );

    console.log(
      "Password entered:",
      password.length > 0
        ? "YES"
        : "NO"
    );


    // Validate

    if (!validate()) {

      console.log(
        "Login validation failed"
      );

      return;
    }


    try {

      setLoading(true);


      console.log(
        "Sending login request..."
      );


      const response =
        await loginUser({

          email: email.trim(),

          password: password,

        });


      console.log(
        "Login response:",
        response
      );


      // =========================
      // SAVE TOKEN
      // =========================

      if (response?.token) {

        localStorage.setItem(
          "token",
          response.token
        );

      } else {

        console.error(
          "No token received from server"
        );

      }


      // =========================
      // SAVE USER
      // =========================

      if (response?.user) {

        localStorage.setItem(
          "user",
          JSON.stringify(
            response.user
          )
        );

      }


      // =========================
      // REMEMBER ME
      // =========================

      if (rememberMe) {

        localStorage.setItem(
          "rememberEmail",
          email.trim()
        );

      } else {

        localStorage.removeItem(
          "rememberEmail"
        );

      }


      console.log(
        "Login successful"
      );


      // =========================
      // DASHBOARD
      // =========================

      navigate("/dashboard");


    } catch (error: any) {

      console.error(
        "Login Error:",
        error
      );


      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Login Failed";


      alert(message);


    } finally {

      setLoading(false);

    }

  };


  // =========================
  // ENTER KEY
  // =========================

  const handleKeyDown = (
    e: React.KeyboardEvent
  ) => {

    if (
      e.key === "Enter" &&
      !loading
    ) {

      handleLogin();

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
            "linear-gradient(rgba(8,20,45,.55), rgba(0,0,0,.65))",
        }}
      />


      {/* =========================
          LOGIN CONTAINER
      ========================= */}

      <Box
        sx={{
          position: "relative",

          zIndex: 2,

          width: "100%",

          height: "100%",

          display: "flex",

          justifyContent: "flex-end",

          alignItems: "center",

          pr: {
            xs: 2,

            sm: "5%",

            md: "8%",
          },
        }}
      >


        {/* =========================
            LOGIN CARD
        ========================= */}

        <Paper
          elevation={0}
          sx={{
            width: 450,

            maxWidth: "100%",

            p: 5,

            borderRadius: "25px",

            background:
              "rgba(255,255,255,0.12)",

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

              alt="AI Vehicle Intelligence Logo"

              sx={{
                width: 110,

                height: "auto",

                objectFit: "contain",
              }}
            />

          </Box>


          {/* =========================
              HEADING
          ========================= */}

          <Typography
            variant="h4"
            sx={{
              color: "#fff",

              fontWeight: 700,

              textAlign: "center",
            }}
          >
            Welcome Back 👋
          </Typography>


          <Typography
            sx={{
              color: "#D1D5DB",

              textAlign: "center",

              mt: 1,

              mb: 4,
            }}
          >
            Sign in to continue to your AI dashboard
          </Typography>


          {/* =========================
              EMAIL
          ========================= */}

          <TextField
            fullWidth

            label="Email Address"

            margin="normal"

            autoComplete="email"

            value={email}

            onChange={(e) => {

              setEmail(
                e.target.value
              );

              setEmailError("");

            }}

            onKeyDown={handleKeyDown}

            error={
              emailError !== ""
            }

            helperText={
              emailError
            }

            disabled={loading}


            // IMPORTANT:
            // New MUI API

            slotProps={{
              input: {

                startAdornment: (

                  <InputAdornment
                    position="start"
                  >

                    <EmailOutlined
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

              mb: 2,

              "& .MuiOutlinedInput-root": {

                color: "#fff",

                borderRadius:
                  "15px",

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

                  borderWidth:
                    "2px",

                },

              },


              "& .MuiInputLabel-root": {

                color: "#ddd",

              },


              "& .MuiInputLabel-root.Mui-focused": {

                color:
                  "#42A5F5",

              },

            }}
          />


          {/* =========================
              PASSWORD
          ========================= */}

          <TextField
            fullWidth

            label="Password"

            type={
              showPassword
                ? "text"
                : "password"
            }

            margin="normal"

            autoComplete="current-password"

            value={password}

            onChange={(e) => {

              setPassword(
                e.target.value
              );

              setPasswordError("");

            }}

            onKeyDown={handleKeyDown}

            error={
              passwordError !== ""
            }

            helperText={
              passwordError
            }

            disabled={loading}


            // IMPORTANT:
            // New MUI API

            slotProps={{
              input: {

                startAdornment: (

                  <InputAdornment
                    position="start"
                  >

                    <LockOutlined
                      sx={{
                        color:
                          "#90CAF9",
                      }}
                    />

                  </InputAdornment>

                ),


                endAdornment: (

                  <InputAdornment
                    position="end"
                  >

                    <IconButton

                      type="button"

                      onClick={() =>
                        setShowPassword(
                          !showPassword
                        )
                      }

                      disabled={loading}

                      edge="end"
                    >

                      {showPassword ? (

                        <VisibilityOff
                          sx={{
                            color:
                              "#fff",
                          }}
                        />

                      ) : (

                        <Visibility
                          sx={{
                            color:
                              "#fff",
                          }}
                        />

                      )}

                    </IconButton>

                  </InputAdornment>

                ),

              },
            }}


            sx={{

              "& .MuiOutlinedInput-root": {

                color: "#fff",

                borderRadius:
                  "15px",

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

                  borderWidth:
                    "2px",

                },

              },


              "& .MuiInputLabel-root": {

                color: "#ddd",

              },


              "& .MuiInputLabel-root.Mui-focused": {

                color:
                  "#42A5F5",

              },

            }}
          />


          {/* =========================
              REMEMBER ME / FORGOT
          ========================= */}

          <Box
            sx={{
              mt: 2,

              display: "flex",

              justifyContent:
                "space-between",

              alignItems:
                "center",

              gap: 1,
            }}
          >

            <FormControlLabel

              control={

                <Checkbox

                  checked={
                    rememberMe
                  }

                  onChange={(e) =>

                    setRememberMe(
                      e.target.checked
                    )

                  }

                  disabled={loading}

                  sx={{

                    color: "#fff",

                    "&.Mui-checked": {

                      color:
                        "#42A5F5",

                    },

                  }}

                />

              }

              label={

                <Typography
                  sx={{
                    color: "#fff",

                    fontSize: 14,
                  }}
                >
                  Remember Me
                </Typography>

              }

            />


            <Link

              component={RouterLink}

              to="/forgot-password"

              underline="hover"

              sx={{

                color:
                  "#90CAF9",

                fontSize: 14,

                fontWeight: 600,

                cursor:
                  "pointer",

                whiteSpace:
                  "nowrap",

              }}
            >
              Forgot Password?
            </Link>

          </Box>


          {/* =========================
              LOGIN BUTTON
          ========================= */}

          <Button

            fullWidth

            variant="contained"

            startIcon={
              !loading &&
              <LoginRoundedIcon />
            }

            onClick={handleLogin}

            disabled={loading}

            sx={{

              mt: 4,

              height: 55,

              borderRadius:
                "15px",

              fontWeight: 700,

              fontSize: 17,

              textTransform:
                "none",

              transition:
                "all .3s ease",

              background:
                "linear-gradient(135deg,#2563EB,#3B82F6)",

              boxShadow:
                "0 15px 35px rgba(37,99,235,.45)",


              "&:hover": {

                transform:
                  "translateY(-3px) scale(1.02)",

                background:
                  "linear-gradient(135deg,#1D4ED8,#2563EB)",

                boxShadow:
                  "0 20px 45px rgba(37,99,235,.55)",

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
                size={24}
                sx={{
                  color: "#fff",
                }}
              />

            ) : (

              "Login"

            )}

          </Button>


          {/* =========================
              REGISTER
          ========================= */}

          <Typography
            sx={{

              mt: 3,

              textAlign:
                "center",

              color:
                "#D1D5DB",

              fontSize: 15,

            }}
          >

            Don't have an account?{" "}

            <Link

              component={
                RouterLink
              }

              to="/register"

              underline="hover"

              sx={{

                color:
                  "#42A5F5",

                fontWeight: 600,

                cursor:
                  "pointer",

              }}
            >
              Create Account
            </Link>

          </Typography>


          {/* =========================
              FOOTER
          ========================= */}

          <Typography
            sx={{

              mt: 4,

              textAlign:
                "center",

              color:
                "#D1D5DB",

              fontSize: 13,

            }}
          >
            © 2026 AI Vehicle Intelligence Platform
          </Typography>


          <Typography
            sx={{

              textAlign:
                "center",

              color:
                "#9CA3AF",

              fontSize: 12,

              mt: 0.5,

            }}
          >
            Version 1.0
          </Typography>


        </Paper>

      </Box>

    </Box>

  );

};


export default Login;