import React from "react";
import { Outlet } from "react-router-dom";
  //  import React, { useState, useCallback } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import AdminConfigPage from "./admin/components/AdminConfigPage";
import ParkingsPage from "./admin/Pages/ParkingsPage";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword'
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import AdminRoutes from "./admin/AdminRoutes";

  // const user = JSON.parse(localStorage.getItem("user") || '{}');
const App: React.FC = () => {
  return <Outlet />;
};

export default App;
