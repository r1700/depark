import React, { useState } from "react";
import LoginScreen from './components/screen-login/LoginScreen';
import { Box, Button, Container, Typography } from "@mui/material";
const App: React.FC = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const handleLogin = React.useCallback(() => {
    setLoggedIn(true);
  }, []);
  const handleLogout = () => setLoggedIn(false);
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
};
export default App;