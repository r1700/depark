import React, { FC } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import UnifiedEntry from './components/UnifiedEntry/UnifiedEntry';
import VehicleQueue from './components/VehicleQueue/VehicleQueue';
const App: FC = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<UnifiedEntry />} />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
