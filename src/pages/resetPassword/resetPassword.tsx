import { useState } from "react";

import {
    useLocation,
    useNavigate,
} from "react-router-dom";

import {
    Box,
    Paper,
    Typography,
    TextField,
    Button,
    InputAdornment,
    IconButton,
    Alert,
    CircularProgress,
} from "@mui/material";

import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

import backgroundImage from "../../assets/images/login-bg.png";
import logo from "../../assets/images/logo.png";

const ResetPassword = () => {

    const navigate = useNavigate();
    const location = useLocation();

    // =====================================================
    // GET EMAIL
    // =====================================================

    const navigationEmail =
        (location.state as { email?: string })?.email || "";

    const storedEmail =
        localStorage.getItem("resetEmail") || "";

    const [email, setEmail] = useState(
        navigationEmail || storedEmail
    );

    // =====================================================
    // PASSWORD STATES
    // =====================================================

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [showPassword, setShowPassword] =
        useState(false);

    const [showConfirmPassword, setShowConfirmPassword] =
        useState(false);

    // =====================================================
    // OTHER STATES
    // =====================================================

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    // =====================================================
    // RESET PASSWORD
    // =====================================================

    const handleReset = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        // =====================================================
        // EMAIL VALIDATION
        // =====================================================

        const cleanEmail = email.trim();

        if (!cleanEmail) {

            setError(
                "Please enter your registered email address."
            );

            return;
        }

        const emailPattern =
            /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

        if (!emailPattern.test(cleanEmail)) {

            setError(
                "Please enter a valid email address."
            );

            return;
        }

        // =====================================================
        // PASSWORD VALIDATION
        // =====================================================

        if (!password) {

            setError(
                "Please enter your new password."
            );

            return;
        }

        if (!confirmPassword) {

            setError(
                "Please confirm your new password."
            );

            return;
        }

        if (password.length < 6) {

            setError(
                "Password must contain at least 6 characters."
            );

            return;
        }

        if (password !== confirmPassword) {

            setError(
                "Passwords do not match."
            );

            return;
        }

        // =====================================================
        // API REQUEST
        // =====================================================

        try {

            setLoading(true);

            console.log(
                "================================="
            );

            console.log(
                "RESET PASSWORD REQUEST"
            );

            console.log(
                "Email:",
                cleanEmail
            );

            console.log(
                "Password entered: YES"
            );

            console.log(
                "================================="
            );

            const response = await fetch(
                "http://localhost:5000/api/forgot-password/reset",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                        email: cleanEmail,
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            console.log(
                "Reset Password API Response:",
                data
            );

            // =====================================================
            // CHECK RESPONSE
            // =====================================================

            if (!response.ok) {

                throw new Error(
                    data?.message ||
                    "Unable to reset password."
                );
            }

            // =====================================================
            // SUCCESS
            // =====================================================

            setSuccess(
                "Password reset successfully! Redirecting to login..."
            );

            localStorage.removeItem(
                "resetEmail"
            );

            setTimeout(() => {

                navigate("/");

            }, 2000);

        } catch (err: any) {

            console.error(
                "Reset Password Error:",
                err
            );

            setError(
                err?.message ||
                "Unable to reset password. Please try again."
            );

        } finally {

            setLoading(false);

        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (

        <Box
            sx={{
                width: "100%",
                minHeight: "100vh",

                backgroundImage: `
                    linear-gradient(
                        rgba(8,20,45,.65),
                        rgba(0,0,0,.75)
                    ),
                    url(${backgroundImage})
                `,

                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",

                display: "flex",
                justifyContent: "center",
                alignItems: "center",

                p: 2,
            }}
        >

            {/* =================================================
                RESET PASSWORD CARD
            ================================================= */}

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

                {/* =================================================
                    BACK BUTTON
                ================================================= */}

                <Button
                    startIcon={
                        <ArrowBackIcon />
                    }

                    onClick={() =>
                        navigate("/forgot-password")
                    }

                    disabled={loading}

                    sx={{
                        color: "#90CAF9",
                        textTransform: "none",
                        mb: 2,

                        "&:hover": {
                            background:
                                "rgba(144,202,249,.08)",
                        },
                    }}
                >
                    Back
                </Button>

                {/* =================================================
                    LOGO
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
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

                {/* =================================================
                    LOCK ICON
                ================================================= */}

                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        mb: 2,
                    }}
                >

                    <Box
                        sx={{
                            width: 80,
                            height: 80,

                            borderRadius: "50%",

                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",

                            background:
                                "linear-gradient(135deg,#2563EB,#3B82F6)",

                            boxShadow:
                                "0 10px 35px rgba(37,99,235,.45)",
                        }}
                    >

                        <LockOutlinedIcon
                            sx={{
                                color: "#fff",
                                fontSize: 42,
                            }}
                        />

                    </Box>

                </Box>

                {/* =================================================
                    TITLE
                ================================================= */}

                <Typography
                    variant="h4"

                    sx={{
                        textAlign: "center",
                        color: "#fff",
                        fontWeight: 700,
                    }}
                >
                    Reset Password
                </Typography>

                <Typography
                    sx={{
                        color: "#D1D5DB",
                        textAlign: "center",
                        mt: 1,
                        mb: 3,
                        lineHeight: 1.6,
                    }}
                >
                    Enter your email and create a new password.
                </Typography>

                {/* =================================================
                    EMAIL
                ================================================= */}

                <TextField
                    fullWidth

                    label="Registered Email"

                    type="email"

                    value={email}

                    onChange={(e) => {

                        setEmail(e.target.value);
                        setError("");

                    }}

                    disabled={loading}

                    sx={{
                        mb: 2,

                        "& .MuiOutlinedInput-root": {

                            color: "#fff",

                            borderRadius: "15px",

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

                            color: "#42A5F5",
                        },
                    }}

                    slotProps={{
                        input: {

                            startAdornment: (

                                <InputAdornment
                                    position="start"
                                >

                                    <EmailOutlinedIcon
                                        sx={{
                                            color: "#90CAF9",
                                        }}
                                    />

                                </InputAdornment>

                            ),
                        },
                    }}
                />

                {/* =================================================
                    PASSWORD FORM
                ================================================= */}

                <form onSubmit={handleReset}>

                    {/* =================================================
                        NEW PASSWORD
                    ================================================= */}

                    <TextField
                        fullWidth

                        label="New Password"

                        type={
                            showPassword
                                ? "text"
                                : "password"
                        }

                        value={password}

                        onChange={(e) => {

                            setPassword(
                                e.target.value
                            );

                            setError("");

                        }}

                        disabled={loading}

                        sx={{
                            mb: 2,

                            "& .MuiOutlinedInput-root": {

                                color: "#fff",

                                borderRadius: "15px",

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

                                color: "#42A5F5",
                            },
                        }}

                        slotProps={{
                            input: {

                                startAdornment: (

                                    <InputAdornment
                                        position="start"
                                    >

                                        <LockOutlinedIcon
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
                                        >

                                            {showPassword ? (

                                                <VisibilityOffIcon
                                                    sx={{
                                                        color:
                                                            "#fff",
                                                    }}
                                                />

                                            ) : (

                                                <VisibilityIcon
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
                    />

                    {/* =================================================
                        CONFIRM PASSWORD
                    ================================================= */}

                    <TextField
                        fullWidth

                        label="Confirm Password"

                        type={
                            showConfirmPassword
                                ? "text"
                                : "password"
                        }

                        value={confirmPassword}

                        onChange={(e) => {

                            setConfirmPassword(
                                e.target.value
                            );

                            setError("");

                        }}

                        disabled={loading}

                        sx={{
                            mb: 2,

                            "& .MuiOutlinedInput-root": {

                                color: "#fff",

                                borderRadius: "15px",

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

                                color: "#42A5F5",
                            },
                        }}

                        slotProps={{
                            input: {

                                startAdornment: (

                                    <InputAdornment
                                        position="start"
                                    >

                                        <LockOutlinedIcon
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
                                                setShowConfirmPassword(
                                                    !showConfirmPassword
                                                )
                                            }

                                            disabled={loading}
                                        >

                                            {showConfirmPassword ? (

                                                <VisibilityOffIcon
                                                    sx={{
                                                        color:
                                                            "#fff",
                                                    }}
                                                />

                                            ) : (

                                                <VisibilityIcon
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
                    />

                    {/* =================================================
                        ERROR
                    ================================================= */}

                    {error && (

                        <Alert
                            severity="error"

                            sx={{
                                mb: 2,
                                borderRadius: "12px",
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
                                mb: 2,
                                borderRadius: "12px",
                            }}
                        >
                            {success}
                        </Alert>

                    )}

                    {/* =================================================
                        RESET BUTTON
                    ================================================= */}

                    <Button
                        fullWidth

                        type="submit"

                        variant="contained"

                        disabled={loading}

                        sx={{
                            height: 58,

                            borderRadius: "15px",

                            fontWeight: 700,

                            fontSize: 17,

                            textTransform: "none",

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

                            "Reset Password"

                        )}

                    </Button>

                </form>

                {/* =================================================
                    FOOTER
                ================================================= */}

                <Typography
                    sx={{
                        mt: 3,

                        textAlign: "center",

                        color: "#9CA3AF",

                        fontSize: 13,
                    }}
                >
                    🔒 Your password is securely protected.
                </Typography>

            </Paper>

        </Box>
    );
};

export default ResetPassword;