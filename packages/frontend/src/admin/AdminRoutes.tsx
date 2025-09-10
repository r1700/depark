// src/admin/AdminRoutes.tsx
import React, { useCallback } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./app/store"; 

import LoginScreen from "./components/screen-login/LoginScreen";
import Layout from "./components/layout/layout";
import AdminDashboard from "./components/adminDashboard/AdminDashboard";
import HrDashboard from "./components/hrDashboard/HrDashboard";
import AdminConfigPage from "./components/AdminConfigPage";
import ParkingsPage from "./Pages/ParkingsPage";
import AdminUsersPage from "./Pages/adminUser/AdminUsersPage";
import ParkingStatsPage from "./app/pages/parkingStats/parkingStats";
import SurfaceStatsPage from "./app/pages/surfaceStats/surfaceStats";
import FeedbackQuestions from "./components/feedbackQuestions/FeedbackQuestions";
import FeedbackAnswersReports from "./components/FeedbackAnswersReports/FeedbackAnswersReports";
import Dashboard from "./Pages/hrDashboard/DashboardPage";

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
    <Provider store={store}>
      <Routes>
        <Route path="login" element={<LoginScreen />} />

        <Route
          path=""
          element={
            !user ? (
              <Navigate to="login" replace />
            ) : String(user.role) === "2" ? (
              <Navigate to="layout/admin" replace />
            ) : (
              <Navigate to="layout/hr-dashboard" replace />
            )
          }
        />

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
          <Route path="admin" element={<Dashboard/>} />
          <Route path="hr-dashboard" element={<Dashboard />} />
          <Route path="admin-config" element={<AdminConfigPage />} />
          <Route path="parkings" element={<ParkingsPage />} />
          <Route path="admin-users" element={<AdminUsersPage />} />
          <Route path="feedback" element={<FeedbackQuestions />} />

          <Route path="reports">
            <Route path="parking-stats" element={<ParkingStatsPage />} />
            <Route path="surface-stats" element={<SurfaceStatsPage />} />
            <Route path="feedback-answers" element={<FeedbackAnswersReports />} />
          </Route>

          <Route
            index
            element={
              String(user?.role) === "2" ? (
                <Navigate to="admin" replace />
              ) : (
                <Navigate to="hr-dashboard" replace />
              )
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/admin" replace />} />
      </Routes>
    </Provider>
  );
};

export default AdminRoutes;