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