import axios from "axios";

const API_BASE = "http://localhost:5000/api/vehicles";

const authHeader = () => {
  const token = localStorage.getItem("token");
  return { Authorization: `Bearer ${token}` };
};

export const getVehicles = async () => {
  const res = await axios.get(API_BASE, { headers: authHeader() });
  return res.data;
};

export const deleteVehicle = async (id: number) => {
  const res = await axios.delete(`${API_BASE}/${id}`, { headers: authHeader() });
  return res.data;
};