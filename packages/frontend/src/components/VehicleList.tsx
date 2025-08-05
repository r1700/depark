
import React, { useEffect, useState } from "react";
import {
  Card,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
  IconButton,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { VehicleReportDialog } from "./VehicleReportDialog";

interface Vehicle {
  id: string;
  licensePlate: string;
  location?: string;
  dimensionOverrides?: {
    length?: string;
    weight?: string;
    width?: string;
    height?: string;
  };
}

export const VehicleList = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [queuePosition, setQueuePosition] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [userId, setUserId] = useState<string>(); // לדוגמה, userId סטטי


useEffect(() => {
  const userStr = localStorage.getItem('user');
  if (userStr !== null) {
    try {
      const user = JSON.parse(userStr);
      if (user?.userId) {
        setUserId(user.userId);
      }
    } catch (e) {
      console.error("Failed to parse user from localStorage", e);
    }
  }
}, []);



  useEffect(() => {
    fetch("/api/vehicles")
      .then(async (res) => {
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || "Server Error");
        }
        return res.json();
      })
      .then(setVehicles)
      .catch((err) => {
        console.error("Fetch error:", err.message);
      });
  }, []);

  const getVehicleCategory = (v: Vehicle) => {
    const dims = v.dimensionOverrides;
    if (!dims || !dims.length || !dims.weight) return "unknown";
    const length = parseInt(dims.length);
    const weight = parseInt(dims.weight);
    if (length <= 4500 && weight <= 1300) return "private";
    if (length <= 5000 && weight <= 2200) return "van";
    if (length <= 7000 && weight <= 3500) return "truck_light";
    return "unknown";
  };

  const iconForCategory = (category: string) => {
    const iconProps = { sx: { fontSize: 80 } };
    switch (category) {
      case "private":
        return <DirectionsCarIcon {...iconProps} />;
      case "van":
        return <AirportShuttleIcon {...iconProps} />;
      case "truck_light":
        return <LocalTaxiIcon {...iconProps} />;
      default:
        return <HelpOutlineIcon {...iconProps} />;
    }
  };

  const requestVehicle = (vehicleId: string) => {
    const pos = Math.floor(Math.random() * 10) + 1;
    setQueuePosition((prev) => ({ ...prev, [vehicleId]: pos }));
  };

  const vehicle = vehicles[currentIndex];
  const category = vehicle ? getVehicleCategory(vehicle) : "unknown";
  const icon = iconForCategory(category);

  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" sx={{ mb: 4 }}>
        User vehicles
      </Typography>
      {vehicle && (
        <Card
          sx={{
            p: 2,
            width: 220,
            height: 250,
            textAlign: "center",
            cursor: "pointer",
            boxShadow: 4,
            borderRadius: 3,
            transition: "0.3s",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack spacing={1} alignItems="center" justifyContent="center">
            {icon}
          
            <Typography fontSize="0.9rem">Plate: {vehicle.licensePlate}</Typography>
            <Button
              size="small"
              onClick={() => requestVehicle(vehicle.id)}
              sx={{ mt: 1, textTransform: "none" }}
              variant="contained"
            >
              Request
            </Button>
            {queuePosition[vehicle.id] && (
              <Alert severity="info" sx={{ mt: 1 }}>
                Queue: {queuePosition[vehicle.id]}
              </Alert>
            )}
          </Stack>
        </Card>
      )}
      <Box display="flex" justifyContent="center" gap={1} mt={2}>
        {vehicles.map((_, idx) => (
          <IconButton key={idx} onClick={() => setCurrentIndex(idx)}>
            <FiberManualRecordIcon
              fontSize="small"
              color={idx === currentIndex ? "primary" : "disabled"}
            />
          </IconButton>
        ))}
      </Box>
      <Button
        variant="contained"
        sx={{ mt: 3, textTransform: "none" }}
        onClick={() => setReportOpen(true)}
      >
        View report
      </Button>
      {/* הפעלת דיאלוג הדוח עם userId */}
      <VehicleReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        // vehicles={vehicles}
        userId={userId  ?? null} // העברת userId חיונית!
           />
    </Box>
  );
};