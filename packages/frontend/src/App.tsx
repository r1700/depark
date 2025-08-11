import React, { useState, useEffect, useCallback } from "react";
import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

const App: React.FC = () => {

  return (
    <>
      <Outlet />
    </>

  );
};

export default App;
