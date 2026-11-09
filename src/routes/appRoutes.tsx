import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Dashboard from "../pages/dashboard/dashboard";
import Vehicles from "../pages/vehicles/vehicles";
import Maintenance from "../pages/maintenance/maintenance";
import Reports from "../pages/reports/reports";
import ForgotPassword from "../pages/forgotpassword/forgotPassword";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/vehicles" element={<Vehicles />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;