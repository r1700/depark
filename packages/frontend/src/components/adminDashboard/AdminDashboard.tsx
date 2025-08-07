import React from "react";
import { Box, Typography, Container } from "@mui/material";
const AdminDashboard: React.FC = () => {
  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, p: 4, boxShadow: 3, borderRadius: 2, bgcolor: "background.paper" }}>
        <Typography variant="h4" gutterBottom>
          Welcome Admin!
        </Typography>
      </Box>
    </Container>
  );
};
export default AdminDashboard;