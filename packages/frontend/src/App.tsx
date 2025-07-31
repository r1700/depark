import React, { useState, useEffect, useCallback } from "react";
import LoginScreen from './components/screen-login/LoginScreen';
import { Box, Button, Container, Typography } from "@mui/material";

const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  const handleLogin = useCallback((token?: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setLoggedIn(true);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: "center", direction: "ltr" }}>
      {loggedIn ? (
        <Box>
          <Typography variant="h4" gutterBottom>
            Welcome!
          </Typography>
          <Button variant="contained" onClick={handleLogout}>
            Logout
          </Button>
        </Box>
      ) : (
        <LoginScreen onLogin={handleLogin} />
      )}
    </Container>
  );

}
export default App;