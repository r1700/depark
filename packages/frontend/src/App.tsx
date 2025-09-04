import React from "react";
import { Outlet } from "react-router-dom";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/components/HomePage/HomePage";
import UnifiedEntry from "./tablet/components/UnifiedEntry/UnifiedEntry";
import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword';
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import AdminRoutes from "./admin/AdminRoutes";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />
        <Route path="/mobile" element={<Otp />} />
        <Route path="/tablet" element={localStorage.getItem("floorNumber") ? <UnifiedEntry /> : <HomePage />} />
        <Route path="/parkings" element={<ParkingsPage />} />
        <Route path="/admin-config" element={<AdminConfigPage />} />
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;