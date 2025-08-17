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
    <Container maxWidth="xs">
      <Box sx={{ textAlign: "center", mt: 8 }}>
        <h1>Welcome!</h1>
        <Typography variant="h5">
          Please enter the floor number
        </Typography>
        <TextField
          label="Floor Number"
          value={floor}
          onChange={(e) => setFloor(e.target.value)}
          type="number"
          sx={{ mt: 2, backgroundColor: 'white', borderRadius: 1 }}
        />
        <Box sx={{ mt: 3 }}>
          <Button variant="contained" onClick={handleSave}>
            Save and continue
          </Button>
        </Box>
      </Box>
    </Container>
  );
}
