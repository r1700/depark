import { useState } from "react";
import { TextField, Button, Box, Typography, Container } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function HomeScreen({ onSave }: { onSave?: () => void }) {
  const [floor, setFloor] = useState("");
  const navigate = useNavigate();

  const handleSave = () => {
    if (!floor) return;
    localStorage.setItem("floorNumber", floor);
    navigate("/", { replace: true });
  };

  return (
    <Container maxWidth="xs" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: 4,
          boxShadow: 3,
          p: 4,
          width: '100%',
          maxWidth: 400,
          mx: 'auto',
          textAlign: 'center',
        }}
      >
        <h1 style={{ marginBottom: 16 }}>Welcome!</h1>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Please enter the floor number
        </Typography>
        <TextField
          label="Floor Number"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          type="number"
          sx={{ mt: 2, mb: 3, backgroundColor: 'white', borderRadius: 2 }}
          fullWidth
        />
        <Button variant="contained" onClick={handleSave} fullWidth>
          Save and continue
        </Button>
      </Box>
    </Container>
  );
}
