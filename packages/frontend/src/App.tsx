import React, { useState, useEffect, useCallback } from "react";
import LoginPage from "./admin/Pages/loginPage";
<<<<<<< HEAD
import Otp from "./mobile/components/otp";
=======
import Otp from "./mobile/component/otp";
>>>>>>> 08fb09e7 (add)
import HomePage from "./tablet/pages/HomePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

const App: React.FC = () => {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/admin" element={<LoginPage />} />

          <Route path="/mobile" element={<Otp />} />

          <Route path="/" element={<HomePage />} />
        </Routes>
      </Router>
    </>

  );
};

export default App;
