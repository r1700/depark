import React, { useState, useEffect } from 'react';
import { VehicleList } from './components/VehicleList';
import { VehicleRegistrationForm } from './components/VehicleRegistrationForm';
import './App.css';

function App() {

  return (
    <>
    <VehicleList></VehicleList>
    <VehicleRegistrationForm></VehicleRegistrationForm>
     </>
   );
    
}

export default App;