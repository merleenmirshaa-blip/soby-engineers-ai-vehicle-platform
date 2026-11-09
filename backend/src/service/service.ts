import axios from "axios";

const API_URL = "http://localhost:5000/api/auth";

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Registration failed" };
  }
};

export const loginUser = async (userData: {
  email: string;
  password: string;
}) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);
    return response.data;
  } catch (error: any) {
    throw error.response?.data || { message: "Login failed" };
  }
};