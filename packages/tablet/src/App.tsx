import React, { FC } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import UnifiedEntry from './components/UnifiedEntry/UnifiedEntry';
import VehicleQueue from './components/VehicleQueue/VehicleQueue';
import { sampleVehicles } from './data';

const App: FC = () => {
        return (
            <BrowserRouter>
      <Routes>
        <Route path="/" element={<UnifiedEntry />} />
        <Route path="/VehicleQueue" element={<VehicleQueue/>} />
      </Routes>
    </BrowserRouter>
    );
}
export default App;