import React, { useState } from "react";

import {
  Card,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
  Dialog,
  DialogTitle,
  TextField,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import TwoWheelerIcon from "@mui/icons-material/TwoWheeler";
import FireTruckIcon from "@mui/icons-material/FireTruck";
import { VehicleReportDialog } from "./VehicleReportDialog";
import { useForm } from "react-hook-form";
import axios from "axios";
interface Vehicle {
  id: number;
  licensePlate: string;
  model: string;
  location: string;
}
const vehicles: Vehicle[] = [
  { id: 1, licensePlate: "123-45-678", model: "Toyota Corolla", location: "Zone A" },
  { id: 2, licensePlate: "987-65-432", model: "Honda Civic", location: "Zone B" },
  { id: 4, licensePlate: "222-22-222", model: "Nissan Leaf", location: "Zone D" },
  { id: 5, licensePlate: "333-33-333", model: "Suzuki Swift", location: "Zone E" },
  { id: 6, licensePlate: "444-44-444", model: "Ford Transit", location: "Zone F" },
];
export const VehicleRow = () => {
  const [queuePosition, setQueuePosition] = useState<Record<number, number>>({});
  const [reportOpen, setReportOpen] = useState(false);
  const [hoveredVehicleId, setHoveredVehicleId] = useState<number | null>(null);
  const requestVehicle = (vehicleId: number) => {
    const randomPosition = Math.floor(Math.random() * 10) + 1;
    setQueuePosition((prev) => ({ ...prev, [vehicleId]: randomPosition }));
  };
  const iconForVehicle = (id: number) => {
    const iconProps = { sx: { fontSize: 80 } };
    const icons = [
      <DirectionsCarIcon {...iconProps} />,
      <LocalTaxiIcon {...iconProps} />,
      <ElectricCarIcon {...iconProps} />,
      <AirportShuttleIcon {...iconProps} />,
      <TwoWheelerIcon {...iconProps} />,
      <FireTruckIcon {...iconProps} />,
    ];
    return icons[(id - 1) % icons.length];
  };
  const handleOpenReport = () => {
    setReportOpen(true);
  };
  const handleCloseReport = () => {
    setReportOpen(false);
  };
  return (
    <Box p={3} display="flex" flexDirection="column" alignItems="center">
      <Typography variant="h4" sx={{ mb: 6, fontSize: "2.5rem", fontWeight: "bold" }}>
        User Vehicles
      </Typography>
      <Box display="flex" flexWrap="wrap" gap={2} justifyContent="center">
        {vehicles.map((vehicle) => (
          <Card
            key={vehicle.id}
            sx={{
              p: 2,
              width: 220,
              height: 250,
              textAlign: "center",
              cursor: "pointer",
              boxShadow: 4,
              borderRadius: 3,
              transition: "0.3s",
              position: "relative",
              ":hover": { transform: "scale(1.07)" },
              backgroundColor: "transparent",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
            onMouseEnter={() => setHoveredVehicleId(vehicle.id)}
            onMouseLeave={() => setHoveredVehicleId(null)}
          >
            <Stack spacing={1} alignItems="center" justifyContent="center">
              {hoveredVehicleId === vehicle.id ? (
                <Box textAlign="center">
                  <Typography sx={{ fontSize: "1.2rem", fontWeight: "bold", color: "#333" }}>
                    {vehicle.model}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", color: "#555" }}>
                    Plate: {vehicle.licensePlate}
                  </Typography>
                  <Typography sx={{ fontSize: "1rem", color: "#555" }}>
                    Location: {vehicle.location}
                  </Typography>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: "capitalize", mt: 1 }}
                    onClick={() => requestVehicle(vehicle.id)}
                  >
                    Request vehicle
                  </Button>
                  {queuePosition[vehicle.id] && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Queue: {queuePosition[vehicle.id]}
                    </Alert>
                  )}
                </Box>
              ) : (
                <>
                  <Box display="flex" justifyContent="center" alignItems="center">
                    {iconForVehicle(vehicle.id)}
                  </Box>
                  <Button
                    variant="contained"
                    size="small"
                    sx={{ textTransform: "capitalize", mt: 1 }}
                    onClick={() => requestVehicle(vehicle.id)}
                  >
                    Request vehicle
                  </Button>
                  {queuePosition[vehicle.id] && (
                    <Alert severity="info" sx={{ mt: 1 }}>
                      Queue: {queuePosition[vehicle.id]}
                    </Alert>
                  )}
                </>
              )}
            </Stack>
          </Card>
        ))}
      </Box>
      <Button
        variant="contained"
        sx={{ marginTop: 3, textTransform: "capitalize", maxWidth: 300 }}
        onClick={handleOpenReport}
      >
        View Vehicle Report
      </Button>
   <VehicleReportDialog
  open={reportOpen}
  onClose={handleCloseReport}
  userId={"USER_ID_HERE"}
/>
    </Box>
  );
};


interface VehicleFormInputs {
  name: string;
  licensePlate: string;
  category: string;
}
export const VehicleRegistrationForm = () => {
  const [open, setOpen] = useState(false);
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VehicleFormInputs>();
  const onSubmit = async (data: VehicleFormInputs) => {
    try {
      await axios.post("/vehicles", data);
      setSuccess(true);
      setServerError("");
      reset();
    } catch {
      setServerError("Error registering vehicle");
      setSuccess(false);
    }
  };
  return (
    <>
      <Box textAlign="center" my={2}>
        <Button variant="contained" color="primary"  sx={{ textTransform: "capitalize" }} onClick={() => setOpen(true)}>
          Add Vehicle
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Vehicle</DialogTitle>
        <DialogContent>
          <Box component="form" id="vehicle-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Vehicle Name"
                fullWidth
                {...register("name", { required: "This field is required" })}
                error={!!errors.name}
                helperText={errors.name?.message}
              />
              <TextField
                label="License Plate"
                fullWidth
                {...register("licensePlate", {
                  required: "This field is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                error={!!errors.licensePlate}
                helperText={errors.licensePlate?.message}
              />
              <TextField
                label="Category"
                fullWidth
                {...register("category", { required: "This field is required" })}
                error={!!errors.category}
                helperText={errors.category?.message}
              />
              {serverError && <Alert severity="error">{serverError}</Alert>}
              {success && <Alert severity="success">Vehicle registered successfully!</Alert>}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="secondary">
            Close
          </Button>
          <Button form="vehicle-form" type="submit" variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};