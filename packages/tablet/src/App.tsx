import { FC, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import UnifiedEntry from "./components/UnifiedEntry/UnifiedEntry";
import VehicleQueue from "./components/VehicleQueue/VehicleQueue";
import HomeScreen from "./components/HomeScreen/HomeScreen";

function Gate() {
  const hasFloor = !!localStorage.getItem("floorNumber");
  return hasFloor ? <UnifiedEntry /> : <Navigate to="/home" replace />;
}

const App: FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Gate />} />
        <Route path="/home" element={<HomeScreen/>} />
        <Route path="/VehicleQueue" element={<VehicleQueue />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;