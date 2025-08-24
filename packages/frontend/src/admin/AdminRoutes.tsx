// src/admin/AdminRoutes.tsx
import React, { useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import LoginScreen from "./components/screen-login/LoginScreen";
import Layout from "./components/layout/layout";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";
import HrDashboard from "./components/hrDashboard/HrDashboard";
import AdminConfigPage from "./components/AdminConfigPage";
import ParkingsPage from "./Pages/ParkingsPage"; // עדכני נתיב אם צריך

function getUserFromStorage() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

const AdminRoutes: React.FC = () => {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const handleLogout = useCallback(() => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  return (
    <Routes>
      {/* Login */}
      <Route path="login" element={<LoginScreen />} />

      {/* /admin -> אם לא מחובר -> לוגין, אחרת ניתוב לפי role */}
      <Route
        path=""
        element={
          !user ? (
            <Navigate to="login" replace />
          ) : user.role === 2 ? ( // role 2 = admin
            <Navigate to="layout/admin" replace />
          ) : (
            <Navigate to="layout/hr-dashboard" replace />
          )
        }
      />

      {/* Layout wrapper – nested routes תחת /admin/layout/* */}
      <Route
        path="layout/*"
        element={
          !user ? (
            <Navigate to="/admin/login" replace />
          ) : (
            <Layout user={user} onLogout={handleLogout} />
          )
        }
      >
        <Route path="admin" element={<AdminDashboard />} />
        <Route path="hr-dashboard" element={<HrDashboard />} />
        <Route path="admin-config" element={<AdminConfigPage />} />
        <Route path="parkings" element={<ParkingsPage />} />
        {/* default inside layout */}
        <Route
          index
          element={
            user?.role === 2 ? <Navigate to="admin" replace /> : <Navigate to="hr-dashboard" replace />
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
};

export default AdminRoutes;