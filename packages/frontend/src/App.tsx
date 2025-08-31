import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword'
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import AdminRoutes from "./admin/AdminRoutes";
import Dashboard from "./admin/Pages/hrDashboard/DashboardPage";
const user = JSON.parse(localStorage.getItem("user") || '{}');
const App: React.FC = () => {

  return (
    <Router>
    <Routes>
  
        {/* <Route path="/" element={<LoginPage />} /> */}
        <Route path="/" element={<Navigate to="/tablet" replace />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mobile" element={<Otp />} />
        <Route path="/tablet" element={<HomePage />} />
        <Route path="/parkings" element={<ParkingsPage />} />
        <Route path="/admin-config" element={<AdminConfigPage />} />
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/hr-dashboard" element={<Dashboard />} />
    </Routes>
  </Router>
  );
};

export default App;
