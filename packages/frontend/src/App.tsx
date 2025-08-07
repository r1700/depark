import React, { useState, useEffect, useCallback } from "react";
import LoginScreen from './components/screen-login/LoginScreen';
import { Box, Button, Container, Typography } from "@mui/material";
import ParkingStatsPage from "./app/pages/adminDashBoard/parkingStats";
import SurfaceStatsPage from "./app/pages/adminDashBoard/surfaceStats";

const App: React.FC = () => {
  
  return (
    // <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center", direction: "ltr" }}>
    //   {loggedIn ? (
    //     <Box>
    //       <Typography variant="h4" gutterBottom>
    //         Welcome!
    //       </Typography>
    //       <Button variant="contained" onClick={handleLogout}>
    //         Logout
    //       </Button>
    //     </Box>
    //   ) : (
    //     // כאן מוסיפים פרופס של onLogin שמקבלת טוקן
    //     <LoginScreen onLogin={handleLogin} />
    //   )}
    // </Container>
    <Container>
      <ParkingStatsPage />
      {/* <SurfaceStatsPage /> */}
    </Container>
  );
};

export default App;
