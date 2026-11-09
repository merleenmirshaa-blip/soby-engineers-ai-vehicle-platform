import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

// =======================
// Register API
// =======================
export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  const response = await API.post(
    "/auth/register",
    userData
  );

  return response.data;
};

// =======================
// Login API
// =======================
export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  const response = await API.post(
    "/auth/login",
    userData
  );

  return response.data;
};

// =======================
// Forgot Password API
// =======================
export const forgotPassword = async (
  email: string
) => {
  const response = await API.post(
    "/auth/forgot-password",
    {
      email: email.trim(),
    }
  );

  return response.data;
};

// =======================
// Reset Password API
// =======================
export const resetPassword = async (
  email: string,
  password: string
) => {
  const response = await API.post(
    "/auth/forgot-password/reset",
    {
      email: email.trim(),
      password,
    }
  );

  return response.data;
};

export default API;