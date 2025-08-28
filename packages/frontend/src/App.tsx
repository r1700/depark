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
const App: React.FC = () => {

  return (
    <Router>
      <Routes>

        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<LoginPage />} />
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
      </Routes>
    </Router>
  );
};

export default App;
