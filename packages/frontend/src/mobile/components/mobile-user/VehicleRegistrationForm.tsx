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
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import axios from "axios";

interface VehicleFormInputs {
  license_plate: string;
  vehicle_model_id?: string;
  color?: string;
  added_by: 'user' | 'hr';
  parking_session_id?: string;
  height?: number;
  width?: number;
  length?: number;
  weight?: number;
  dimensions_source: 'model_reference' | 'manual_override' | 'government_db';
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
      const baseuser_id = userStr ? JSON.parse(userStr).userId : null;
      if (!baseuser_id) {
        setServerError("User ID not found in localStorage");
        setSuccess(false);
        return;
      }
      await axios.post("/api/vehicles2", {
        ...data,
        baseuser_id,
        dimension_overrides: {
          height: data.height,
          width: data.width,
          length: data.length,
          weight: data.weight,
        },
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
          fullWidth
          sx={{
            textTransform: "none",
            maxWidth: 300,
            mx: "auto",
            borderRadius: 2,
            fontWeight: 600,
            background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
            color: "#fff",
            boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
            "&:hover": {
              background: "linear-gradient(90deg, #1565c0 60%, #1976d2 100%)",
            },
          }}
          onClick={() => setOpen(true)}
        >
          Add Vehicle
        </Button>
      </Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            background: "linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)",
            borderRadius: 0,
            boxShadow: "0 8px 32px rgba(30,144,255,0.10)",
          },
        }}
      >
        <DialogTitle
          sx={{
            textAlign: "center",
            fontWeight: 700,
            fontSize: "1.35rem",
            color: "#1976d2",
            letterSpacing: 1,
            pb: 0,
            background: "#e3f2fd",
          }}
        >
          Register New Vehicle
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            id="vehicle-form"
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            sx={{
              mt: 1,
              px: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Stack spacing={2} sx={{ width: "100%", maxWidth: 340 }}>
              <TextField
                label="License Plate"
                fullWidth
                size="small"
                {...register("license_plate", {
                  required: "This field is required",
                  minLength: { value: 6, message: "At least 6 characters" },
                })}
                error={!!errors.license_plate}
                helperText={errors.license_plate?.message}
              />
              <TextField label="Vehicle Model ID" fullWidth size="small" {...register("vehicle_model_id")} />
              <TextField label="Color" fullWidth size="small" {...register("color")} />
              <TextField
                label="Added By"
                fullWidth
                size="small"
                {...register("added_by", { required: "This field is required" })}
                error={!!errors.added_by}
                helperText={errors.added_by?.message}
              />
              <TextField label="Parking Session ID" fullWidth size="small" {...register("parking_session_id")} />

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
                {...register("dimensions_source", { required: "This field is required" })}
                error={!!errors.dimensions_source}
                helperText={errors.dimensions_source?.message}
              />
              {serverError && <Alert severity="error">{serverError}</Alert>}
              {success && <Alert severity="success">Vehicle registered successfully!</Alert>}
            </Stack>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2, background: "#e3f2fd" }}>
          <Button
            onClick={() => setOpen(false)}
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 60%, #1976d2 100%)",
              },
            }}
          >
            Close
          </Button>
          <Button
            form="vehicle-form"
            type="submit"
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 60%, #1976d2 100%)",
              },
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

 

