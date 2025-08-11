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
        
        
        {/* Parkings list page */}
        <Route path="/parkings" element={<ParkingsPage />} />
        
        {/* Admin config page - for new parking lot */}
        <Route path="/admin-config" element={<AdminConfigPage />} />
        
        {/* Admin config page - for editing specific parking lot */}
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        
        {/* Catch all - redirect to parkings */}
        <Route path="*" element={<Navigate to="/parkings" replace />} />
         <Route path="/admin" element={<LoginPage />} />

          <Route path="/mobile" element={<Otp />} />

          <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
