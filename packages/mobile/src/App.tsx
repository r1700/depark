import React from 'react';
import Otp from './component/otp';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {VehicleRow} from '../../frontend/src/components/VehicleList';

const theme = createTheme();

const App: React.FC = () => {
  return (
   <VehicleRow></VehicleRow>
  );
};

export default App;
