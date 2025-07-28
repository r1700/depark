import React from 'react';
import Otp from './component/otp';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const theme = createTheme();

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Otp />
    </ThemeProvider>
  );
};

export default App;
