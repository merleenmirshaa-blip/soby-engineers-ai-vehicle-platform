import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1565C0",
    },
    secondary: {
      main: "#00ACC1",
    },
    background: {
      default: "#F4F7FA",
    },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif",

    h3: {
      fontWeight: 700,
    },

    h4: {
      fontWeight: 600,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          height: 50,
          borderRadius: 10,
          fontSize: "16px",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        variant: "outlined",
        fullWidth: true,
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 18,
        },
      },
    },
  },
});

export default theme;