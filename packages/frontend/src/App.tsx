import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
const App: React.FC = () => {

  return (
    <Router>
      <Routes>
        {/* Default home route */}
        <Route path="/" element={<ParkingsPage />} />
        
        {/* Admin login page */}
        <Route path="/admin" element={<LoginPage />} />
        
        {/* Mobile OTP page */}
        <Route path="/mobile" element={<Otp />} />
        
        {/* Tablet home page */}
        <Route path="/tablet" element={<HomePage />} />
        
        {/* Parkings list page */}
        <Route path="/parkings" element={<ParkingsPage />} />
        
        {/* Admin config page - for new parking lot */}
        <Route path="/admin-config" element={<AdminConfigPage />} />
        
        {/* Admin config page - for editing specific parking lot */}
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        
        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
