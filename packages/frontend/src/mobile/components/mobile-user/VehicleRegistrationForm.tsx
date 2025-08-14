

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
  Stack,
  Box,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";

interface VehicleFormInputs {
  licensePlate: string;
  vehicleModelId?: string;
  color?: string;
  addedBy: 'user' | 'hr';
  ParkingSessionId?: string;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  dimensionsSource: 'model_reference' | 'manual_override' | 'government_db';
}

interface VehicleRegistrationFormProps {
  onSuccess: () => void;
}

export const VehicleRegistrationForm = ({ onSuccess }: VehicleRegistrationFormProps) => {
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
    const userStr = localStorage.getItem("user");
    const userId = userStr ? JSON.parse(userStr).userId : null;
    if (!userId) {
      setServerError("User ID not found in localStorage");
      setSuccess(false);
      return;
    }
    await axios.post("/api/vehicles2", {
      ...data,
      userId,
    });
    setSuccess(true);
    setServerError("");
    reset();
    setOpen(false);
    onSuccess(); 
  } catch {
    setServerError("Error registering vehicle");
    setSuccess(false);
  }
};
  return (
    <>
      <Box textAlign="center" my={2}>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ textTransform: "capitalize", maxWidth: 300, mx: "auto" }}
          onClick={() => setOpen(true)}
        >
          Add Vehicle
          
        </Button>
      </Box>
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Register New Vehicle</DialogTitle>
        <DialogContent>
          <Box component="form" id="vehicle-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <Stack spacing={2} mt={1}>
              <TextField
                label="License Plate"
                fullWidth
                size="small"
                {...register("licensePlate", {
                  required: "This field is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                error={!!errors.licensePlate}
                helperText={errors.licensePlate?.message}
              />
              <TextField label="Vehicle Model ID" fullWidth size="small" {...register("vehicleModelId")} />
              <TextField label="Color" fullWidth size="small" {...register("color")} />
               <TextField
                label="Added By"
                fullWidth
                size="small"
                {...register("addedBy", { required: "This field is required" })}
                error={!!errors.addedBy}
                helperText={errors.addedBy?.message}
              />
              <TextField label="ParkingSessionId" fullWidth size="small" {...register("ParkingSessionId")} />

              <Box display="flex" gap={2}>
                <TextField label="Height" fullWidth type="number" size="small" {...register("height")} />
                <TextField label="Width" fullWidth type="number" size="small" {...register("width")} />
              </Box>

              <Box display="flex" gap={2}>
                <TextField label="Length" fullWidth type="number" size="small" {...register("length")} />
                <TextField label="Weight" fullWidth type="number" size="small" {...register("weight")} />
              </Box>
              <TextField
                label="Dimensions Source"
                fullWidth
                size="small"
                {...register("dimensionsSource", { required: "This field is required" })}
                error={!!errors.dimensionsSource}
                helperText={errors.dimensionsSource?.message}
              />
              {serverError && <Alert severity="error">{serverError}</Alert>}
              {success && <Alert severity="success">Vehicle registered successfully!</Alert>}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)} color="secondary">Close</Button>
          <Button form="vehicle-form" type="submit" variant="contained" color="primary">Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

