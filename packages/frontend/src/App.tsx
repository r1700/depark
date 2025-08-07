import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginScreen from './components/screen-login/LoginScreen';
import { Container } from "@mui/material";
import AdminConfigPage from "./components/AdminConfigPage";
import ParkingsPage from "./Pages/ParkingsPage";

const App: React.FC = () => {
  // Always show as logged in for now - skip login screen
  const [loggedIn, setLoggedIn] = useState<boolean>(true);

  // הפונקציה לטיפול בכניסה מוצלחת, מקבלת טוקן
  const handleLogin = useCallback((token?: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setLoggedIn(true);
  }, []);

  if (!loggedIn) {
    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center", direction: "ltr" }}>
        <LoginScreen onLogin={handleLogin} />
      </Container>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Default route - redirect to parkings */}
        <Route path="/" element={<Navigate to="/parkings" replace />} />
        
        {/* Parkings list page */}
        <Route path="/parkings" element={<ParkingsPage />} />
        
        {/* Admin config page - for new parking lot */}
        <Route path="/admin-config" element={<AdminConfigPage />} />
        
        {/* Admin config page - for editing specific parking lot */}
        <Route path="/admin-config/:lotId" element={<AdminConfigPage />} />
        
        {/* Catch all - redirect to parkings */}
        <Route path="*" element={<Navigate to="/parkings" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
