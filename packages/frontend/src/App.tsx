import React, { useState, useEffect, useCallback } from "react";
// import LoginPage from "./admin/Pages/loginPage";
import Otp from "./mobile/components/otp";
import HomePage from "./tablet/pages/HomePage";
import { BrowserRouter as Router, Route, Routes, Outlet } from "react-router-dom";

const App: React.FC = () => {

  return (
    <>
    <Outlet></Outlet>
      {/* <Router>
        <Routes>

          <Route path="/admin" element={<LoginPage />} />

          <Route path="/mobile" element={<Otp />} />

          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router> */}
    </>

  );
};

export default App;
