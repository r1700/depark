import React, { useState } from "react";
import { Box, Button, Container, Typography } from "@mui/material";

const LoginPage: React.FC = () => {
  // קריאה ראשונית מה־localStorage כדי לטעון אם המשתמש כבר מחובר
  const [loggedIn, setLoggedIn] = useState<boolean>(() => {
    return !!localStorage.getItem("token");
  });

  // הפונקציה לטיפול בכניסה מוצלחת, מקבלת טוקן
  // const handleLogin = useCallback((token?: string) => {
  //   if (token) {
  //     localStorage.setItem("token", token);
  //   }
  //   setLoggedIn(true);
  // }, []);

  // פונקצית logout מוחקת את הטוקן ומעדכנת מצב
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
        // כאן מוסיפים פרופס של onLogin שמקבלת טוקן
        // <LoginScreen onLogin={handleLogin} />
        <div>
        </div>
      )}
    </Container>
  );
};

export default LoginPage;