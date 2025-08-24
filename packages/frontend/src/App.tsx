import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
import AdminRoutes from "./admin/AdminRoutes";

const user = JSON.parse(localStorage.getItem("user") || '{}');
const App: React.FC = () => {

  return (
    <Router>
    <Routes>
  
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="/mobile" element={<Otp />} />
        <Route path="/tablet" element={<HomePage />} />
        <Route path="/parkings" element={<ParkingsPage />} />
        <Route path="/admin-config" element={<AdminConfigPage />} />
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </Router>
  );
};

export default App;
