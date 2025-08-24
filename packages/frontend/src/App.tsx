import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
const App: React.FC = () => {

  return (
    <Outlet />
  );
};

export default App;
