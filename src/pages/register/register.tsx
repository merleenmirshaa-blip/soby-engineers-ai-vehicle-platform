import React, { useState } from "react";
import { registerUser } from "../../services/authService";
import bgImage from "../../assets/register-bg.png";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
  Link,
  Snackbar,
  Alert,
} from "@mui/material";

import {
  PersonOutlined,
  AlternateEmailOutlined,
  EmailOutlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

const register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<any>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    let temp: any = {};

    if (!formData.name.trim())
      temp.name = "Full name is required";

    if (!formData.username.trim())
      temp.username = "Username is required";

    if (!formData.email.trim())
      temp.email = "Email is required";
    else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(
        formData.email
      )
    )
      temp.email = "Enter a valid email";

    if (!formData.password)
      temp.password = "Password is required";
    else if (formData.password.length < 6)
      temp.password = "Minimum 6 characters";

    if (!formData.confirmPassword)
      temp.confirmPassword = "Confirm your password";
    else if (
      formData.password !== formData.confirmPassword
    )
      temp.confirmPassword = "Passwords do not match";

    setErrors(temp);

    return Object.keys(temp).length === 0;
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log("Create Account button clicked");

  if (!validate()) {
    console.log("Validation failed");
    return;
  }

  console.log("Validation passed");

  setLoading(true);

  try {
    console.log("Before API");

   const response = await registerUser({
  name: formData.name,
  email: formData.email,
  password: formData.password,
});

alert("API Success");
navigate("/dashboard");

console.log(response);

window.location.href = "/dashboard";

  } catch (error: any) {
    console.error("Register Error:", error);

    setErrorMessage(
      error.response?.data?.message ||
      error.message ||
      "Registration Failed"
    );
  } finally {
    setLoading(false);
  }
};
    
  return (
  <Box
    sx={{
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      px: 2,
      py: 4,
      backgroundImage: `
      linear-gradient(
      rgba(0,0,0,0.70),
      rgba(0,25,70,0.75)
      ),
      url(${bgImage})
      `,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <Paper
      elevation={24}
      sx={{
        width: { xs: "95%", sm: 460 },
        borderRadius: 6,
        px: 4,
        py: 5,
        background: "rgba(255,255,255,0.10)",
        backdropFilter: "blur(18px)",
        border: "1px solid rgba(255,255,255,0.20)",
      }}
    >
      <Typography
        align="center"
        sx={{
          color: "#fff",
          fontWeight: 700,
          fontSize: "34px",
          fontFamily: "Poppins",
        }}
      >
        AI Vehicle
      </Typography>

      <Typography
        align="center"
        sx={{
          mt: 1,
          color: "#fff",
          fontWeight: 600,
          fontSize: "28px",
          fontFamily: "Poppins",
        }}
      >
        Create Account
      </Typography>

      <Typography
        align="center"
        sx={{
          color: "#d9d9d9",
          mt: 1,
          mb: 4,
          fontSize: "15px",
        }}
      >
        Join the Smart Vehicle Intelligence Platform
      </Typography>

 <form onSubmit={handleSubmit}>
      <TextField
fullWidth
label="Full Name"
name="name"
value={formData.name}
onChange={handleChange}
margin="normal"
error={!!errors.name}
helperText={errors.name}
slotProps={{
input:{
startAdornment:(
<InputAdornment position="start">
<PersonOutlined sx={{color:"white"}}/>
</InputAdornment>
)
}
}}
sx={{
  mb: 2,

  "& .MuiOutlinedInput-root": {
    height: 56,
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.20)",
    },

    "&:hover fieldset": {
      borderColor: "#42A5F5",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#42A5F5",
      borderWidth: "2px",
    },
  },

  "& .MuiInputBase-input": {
    color: "#fff",
    WebkitTextFillColor: "#fff",
  },

  "& .MuiInputLabel-root": {
    color: "#D1D5DB",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#42A5F5",
  },

  "& .MuiFormHelperText-root": {
    color: "#FF6B6B",
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow:
      "0 0 0 1000px rgba(255,255,255,0.08) inset",
    WebkitTextFillColor: "#fff",
    transition: "background-color 5000s ease-in-out 0s",
  },
}}
/>
<TextField
fullWidth
label="Username"
name="username"
value={formData.username}
onChange={handleChange}
margin="normal"
error={!!errors.username}
helperText={errors.username}
slotProps={{
input:{
startAdornment:(
<InputAdornment position="start">
<AlternateEmailOutlined sx={{color:"white"}}/>
</InputAdornment>
)
}
}}
sx={{
  mb: 2,

  "& .MuiOutlinedInput-root": {
    height: 56,
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.20)",
    },

    "&:hover fieldset": {
      borderColor: "#42A5F5",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#42A5F5",
      borderWidth: "2px",
    },
  },

  "& .MuiInputBase-input": {
    color: "#fff",
    WebkitTextFillColor: "#fff",
  },

  "& .MuiInputLabel-root": {
    color: "#D1D5DB",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#42A5F5",
  },

  "& .MuiFormHelperText-root": {
    color: "#FF6B6B",
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow:
      "0 0 0 1000px rgba(255,255,255,0.08) inset",
    WebkitTextFillColor: "#fff",
    transition: "background-color 5000s ease-in-out 0s",
  },
}}
/>
<TextField
fullWidth
label="Email Address"
name="email"
value={formData.email}
onChange={handleChange}
margin="normal"
error={!!errors.email}
helperText={errors.email}
slotProps={{
input:{
startAdornment:(
<InputAdornment position="start">
<EmailOutlined sx={{color:"white"}}/>
</InputAdornment>
)
}
}}
sx={{
  mb: 2,

  "& .MuiOutlinedInput-root": {
    height: 56,
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.20)",
    },

    "&:hover fieldset": {
      borderColor: "#42A5F5",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#42A5F5",
      borderWidth: "2px",
    },
  },

  "& .MuiInputBase-input": {
    color: "#fff",
    WebkitTextFillColor: "#fff",
  },

  "& .MuiInputLabel-root": {
    color: "#D1D5DB",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#42A5F5",
  },

  "& .MuiFormHelperText-root": {
    color: "#FF6B6B",
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow:
      "0 0 0 1000px rgba(255,255,255,0.08) inset",
    WebkitTextFillColor: "#fff",
    transition: "background-color 5000s ease-in-out 0s",
  },
}}
/>
<TextField
fullWidth
label="Password"
name="password"
type={showPassword?"text":"password"}
value={formData.password}
onChange={handleChange}
margin="normal"
error={!!errors.password}
helperText={errors.password}
slotProps={{
input:{
startAdornment:(
<InputAdornment position="start">
<LockOutlined sx={{color:"white"}}/>
</InputAdornment>
),
endAdornment:(
<InputAdornment position="end">
<IconButton
onClick={()=>setShowPassword(!showPassword)}
>
{showPassword?
<VisibilityOff sx={{color:"white"}}/>:
<Visibility sx={{color:"white"}}/>
}
</IconButton>
</InputAdornment>
)
}
}}
sx={{
mb:1.5,
"& .MuiOutlinedInput-root":{
borderRadius:4,
height:52,
background:"rgba(255,255,255,.12)"
},
input:{color:"white"},
label:{color:"#ddd"}
}}
/>
<TextField
fullWidth
label="Confirm Password"
name="confirmPassword"
type={showConfirmPassword?"text":"password"}
value={formData.confirmPassword}
onChange={handleChange}
margin="normal"
error={!!errors.confirmPassword}
helperText={errors.confirmPassword}
slotProps={{
input:{
startAdornment:(
<InputAdornment position="start">
<LockOutlined sx={{color:"white"}}/>
</InputAdornment>
),
endAdornment:(
<InputAdornment position="end">
<IconButton
onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
>
{
  showConfirmPassword ? (
    <VisibilityOff sx={{ color: "white" }} />
  ) : (
    <Visibility sx={{ color: "white" }} />
  )
}
</IconButton>
</InputAdornment>
)
}
}}
sx={{
  mb: 2,

  "& .MuiOutlinedInput-root": {
    height: 56,
    borderRadius: "18px",
    background: "rgba(255,255,255,0.08)",
    color: "#fff",

    "& fieldset": {
      borderColor: "rgba(255,255,255,0.20)",
    },

    "&:hover fieldset": {
      borderColor: "#42A5F5",
    },

    "&.Mui-focused fieldset": {
      borderColor: "#42A5F5",
      borderWidth: "2px",
    },
  },

  "& .MuiInputBase-input": {
    color: "#fff",
    WebkitTextFillColor: "#fff",
  },

  "& .MuiInputLabel-root": {
    color: "#D1D5DB",
  },

  "& .MuiInputLabel-root.Mui-focused": {
    color: "#42A5F5",
  },

  "& .MuiFormHelperText-root": {
    color: "#FF6B6B",
  },

  "& input:-webkit-autofill": {
    WebkitBoxShadow:
      "0 0 0 1000px rgba(255,255,255,0.08) inset",
    WebkitTextFillColor: "#fff",
    transition: "background-color 5000s ease-in-out 0s",
  },
}}
/>
<Button
type="submit"
fullWidth
disabled={loading}
sx={{
mt:4,
height:54,
borderRadius:4,
fontWeight:700,
fontSize:16,
textTransform:"none",
background:"linear-gradient(90deg,#0066ff,#00c6ff)",
"&:hover":{
background:"linear-gradient(90deg,#0052cc,#00a8ff)"
}
}}
>
{loading ? "Creating Account..." : "Create Account"}
</Button>
<Typography
textAlign="center"
mt={3}
sx={{color:"white"}}
>
Already have an account?{" "}
<Link
href="/"
underline="hover"
sx={{
color:"#4fc3ff",
fontWeight:600
}}
>
Login
</Link>
</Typography>

</form>
      <Snackbar
        open={successMessage !== ""}
        autoHideDuration={3000}
        onClose={() => setSuccessMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity="success"
          variant="filled"
          onClose={() => setSuccessMessage("")}
        >
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={errorMessage !== ""}
        autoHideDuration={3000}
        onClose={() => setErrorMessage("")}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert
          severity="error"
          variant="filled"
          onClose={() => setErrorMessage("")}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </Paper>
  </Box>
);

};

export default register;
