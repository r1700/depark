
import React, { useState, useCallback } from "react";
import LoginScreen from "../components/screen-login/LoginScreen";
import { Box, Button, Container, Typography } from "@mui/material";

const LoginPage: React.FC = () => {
  // קריאה ראשונית מה־localStorage כדי לבדוק אם המשתמש מחובר
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  // פונקציה לטיפול בכניסה מוצלחת
  const handleLogin = useCallback((token?: string) => {
    if (token) {
      localStorage.setItem("token", token);
    }
    setLoggedIn(true);
  }, []);

  // פונקציה ל־logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("expiresAt");
    setLoggedIn(false);
  };

  return (
    <Container
      maxWidth="sm"
      sx={{ mt: 8, textAlign: "center", direction: "ltr" }}
    >
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
        // כאן אנחנו מוסיפים את LoginScreen עם פרופס onLogin
        <LoginScreen onLogin={handleLogin} />
      )}
    </Container>
  );
};

export default LoginPage;
