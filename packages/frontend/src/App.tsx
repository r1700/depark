import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import AdmainConfigReservedparking from "./admin/components/AdmainConfigReservedparking";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
import UsersPage from "./admin/Pages/UsersPage";
import ReservedParking from "./admin/Pages/ReservedParking";

import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword'
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import AdminRoutes from "./admin/AdminRoutes";

const user = JSON.parse(localStorage.getItem("user") || '{}');
const App: React.FC = () => {

  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/admin/*" element={<AdminRoutes />} />

        <Route path="/mobile" element={<Otp />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/reserved-parking" element={<ReservedParking />} />
        <Route path="/tablet" element={<HomePage />} />
        <Route path="/parkings" element={<ParkingsPage />} />
        <Route path="/admin-config" element={<AdminConfigPage />} />
        <Route path="/admin-config-reservedparking" element={<AdmainConfigReservedparking />} />
        <Route path="/admin-config-reservedparking/:id" element={<AdmainConfigReservedparking />} />
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />

        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
    </Routes>
  </Router>
  );
};

export default App;
