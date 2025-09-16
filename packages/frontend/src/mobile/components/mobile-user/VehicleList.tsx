import React, { useEffect, useState, useCallback } from "react";
import dayjs from "dayjs";
import {
  Card,
  Typography,
  Box,
  Button,
  Stack,
  Alert,
  IconButton,
  Badge,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import AirportShuttleIcon from "@mui/icons-material/AirportShuttle";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import NotificationsIcon from "@mui/icons-material/Notifications";
import FeedbackIcon from "@mui/icons-material/Feedback";
import { useNavigate } from "react-router-dom";
import { VehicleReportDialog } from "./VehicleReportDialog";
import { VehicleRegistrationForm } from "./VehicleRegistrationForm";

interface Vehicle {
  id: string;
  license_plate: string;
  model?: string;
  location?: string;
  dimension_overrides?: {
    length?: string;
    weight?: string;
    width?: string;
    height?: string;
  };
}
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const VehicleRow = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [queuePosition] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [showFeedbackIcon, setShowFeedbackIcon] = useState(false);

  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState<number>(0);

  const [pickupInfo, setPickupInfo] = useState<{
    licensePlate: string;
    position: number;
    assigned_pickup_spot: string;
    estimated_time: string;
  } | null>(null);
  const [pickupDialogOpen, setPickupDialogOpen] = useState(false);

  useEffect(() => {
    const lastFeedback = localStorage.getItem("lastFeedbackSent");
    if (!lastFeedback) {
      setShowFeedbackIcon(true);
      return;
    }
    const diff = dayjs().diff(dayjs(lastFeedback), "day");
    if (diff >= 30) {
      setShowFeedbackIcon(true);
    }
  }, []);


  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      try {
        const res = await fetch(`${API_BASE}/notifications?baseuser_id=${userId}`);
        if (!res.ok) throw new Error("Failed to fetch notifications");
        const data = await res.json();
        const unread = data.filter((n: any) => !n.read).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000);
    return () => clearInterval(interval);
  }, [userId]);


  useEffect(() => {
    const userStr = localStorage.getItem("user");
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


  const fetchVehicles = useCallback(async () => {
    if (!userId) {
      console.warn("No userId — skipping fetch");
      return;
    }
    try {
      const res = await fetch(`${API_BASE}/vehicles/${userId}`);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server Error");
      }
      const data = await res.json();
      setVehicles(data);
      setCurrentIndex(data.length - 1);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchVehicles();
  }, [userId, fetchVehicles]);


  const getVehicleCategory = (v: Vehicle) => {
    const dims = v.dimension_overrides;
    if (!dims?.length || !dims.weight) return "unknown";
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

  const getWaitTime = (estimated_time: string) => {
    const now = new Date();
    const est = new Date(estimated_time);
    const diffMs = est.getTime() - now.getTime();
    const diffMin = Math.max(Math.round(diffMs / 60000), 0);
    return diffMin;
  };


  const handleRequestPickup = async () => {
    const vehicle = vehicles[currentIndex];
    if (!vehicle || !userId) return;
    try {
      const res = await fetch(`${API_BASE}/tablet/retrieve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({

          licensePlate: vehicle.license_plate,
          floor: 'mobile'
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server Error");
      }

      const data = await res.json();

      setPickupInfo({
        licensePlate: vehicle.license_plate,
        position: data.position,
        assigned_pickup_spot: data.assigned_pickup_spot,
        estimated_time: data.estimated_time,
      });

      setPickupDialogOpen(true);
    } catch (err) {
      console.error("Request pickup error:", err);
      alert("שגיאה בשליחת בקשת הרכב");
    }
  };

  // --- Render ---
  const vehicle = vehicles[currentIndex];
  const category = vehicle ? getVehicleCategory(vehicle) : "unknown";
  const icon = iconForCategory(category);

  return (
    <Box
      p={3}
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      alignItems="center"
      sx={{
        background: "linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)",
        borderRadius: 0,
        boxShadow: "0 8px 32px rgba(30,144,255,0.10)",
        maxWidth: 420,
        mx: "auto",
      }}
    >
      {/* Header */}
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
        mb={2}
      >
        <Typography
          variant="h4"
          sx={{ color: "#1976d2", fontWeight: 700, letterSpacing: 1 }}
        >
          User vehicles
        </Typography>
        <Box display="flex" alignItems="center" gap={1}>
          <IconButton
            onClick={() => navigate(`/notifications?baseuser_id=${userId}`)}
            sx={{ position: "relative", p: 0 }}
          >
            <Badge
              badgeContent={unreadCount}
              color="error"
              overlap="circular"
              sx={{
                "& .MuiBadge-badge": {
                  fontSize: "0.7rem",
                  minWidth: 18,
                  height: 18,
                },
              }}
            >
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  width: 48,
                  height: 48,
                }}
              >
                <NotificationsIcon sx={{ fontSize: 28, color: "#fff" }} />
              </Avatar>
            </Badge>
          </IconButton>
          {showFeedbackIcon && (
            <IconButton
              onClick={() => navigate("/FeedbackForm")}
              sx={{ position: "relative", p: 0 }}
            >
              <Avatar
                sx={{
                  bgcolor: "#1976d2",
                  width: 48,
                  height: 48,
                }}
              >
                <FeedbackIcon sx={{ fontSize: 28, color: "#fff" }} />
              </Avatar>
            </IconButton>
          )}
        </Box>
      </Box>

      {/* Vehicle card */}
      {vehicle && (
        <Card
          sx={{
            p: 2,
            width: 320,
            minHeight: 260,
            textAlign: "center",
            boxShadow: "0 4px 16px rgba(30,144,255,0.10)",
            borderRadius: 4,
            background: "linear-gradient(135deg, #e3f2fd 0%, #f8fbff 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Stack spacing={2} alignItems="center" sx={{ width: "100%" }}>
            {icon}
            <Typography fontWeight="bold" sx={{ color: "#1976d2", fontSize: "1.2rem" }}>
              {vehicle.model}
            </Typography>
            <Typography fontSize="1rem" sx={{ color: "#1976d2" }}>
              Plate: {vehicle.license_plate}
            </Typography>
            <Box width="100%">
              <Button
                fullWidth
                size="medium"
                sx={{
                  mt: 1,
                  textTransform: "none",
                  borderRadius: 2,
                  fontWeight: 600,
                  background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
                  color: "#fff",
                  boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
                  "&:hover": {
                    background: "linear-gradient(90deg, #1565c0 60%, #1976d2 100%)",
                  },
                }}
                variant="contained"
                onClick={handleRequestPickup}
              >
                Request
              </Button>
            </Box>
            {queuePosition[vehicle.id] && (
              <Alert
                severity="info"
                sx={{
                  mt: 1,
                  background: "#e3f2fd",
                  color: "#1976d2",
                  borderRadius: 2,
                  boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
                }}
              >
                Queue: {queuePosition[vehicle.id]}
              </Alert>
            )}
          </Stack>
        </Card>
      )}

      {/* Pickup dialog */}
      <Dialog
        open={pickupDialogOpen}
        onClose={() => setPickupDialogOpen(false)}
        PaperProps={{
          sx: {
            borderRadius: 4,
            boxShadow: "0 8px 32px rgba(30,144,255,0.18)",
            background: "linear-gradient(135deg, #e3f0ff 0%, #f8fbff 100%)",
            minWidth: 340,
            px: 3,
            py: 2,
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
          }}
        >
          Pickup Details
        </DialogTitle>
        <DialogContent sx={{ pt: 1 }}>
          {pickupInfo && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, fontSize: "1.1rem" }}>
                <DirectionsCarIcon sx={{ color: "#1976d2", fontSize: 32 }} />
                <span>
                  <strong>License Plate:</strong> {pickupInfo.licensePlate}
                </span>
              </Box>
              <Box
                sx={{
                  background: "#e3f2fd",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                  color: "#1976d2",
                  boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <strong>Queue Position:</strong> {pickupInfo.position}
              </Box>
              <Box
                sx={{
                  background: "#e3f2fd",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                  color: "#1976d2",
                  boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <strong>Pickup Spot:</strong>{" "}
                Floor {pickupInfo.assigned_pickup_spot.split(":")[0]}, Elevator{" "}
                {pickupInfo.assigned_pickup_spot.split(":")[1]}
              </Box>
              <Box
                sx={{
                  background: "#e3f2fd",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  fontWeight: 500,
                  color: "#1976d2",
                  boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
                  width: "100%",
                  textAlign: "center",
                }}
              >
                <strong>Estimated Wait:</strong>{" "}
                {getWaitTime(pickupInfo.estimated_time)} min
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", pb: 1 }}>
          <Button
            onClick={() => setPickupDialogOpen(false)}
            variant="contained"
            sx={{
              borderRadius: 2,
              px: 4,
              fontWeight: 600,
              background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>

      {/* Vehicles dots */}
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

      {/* Bottom actions */}
      <Box mt={3} width="100%" maxWidth={320}>
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 600,
              background: "linear-gradient(90deg, #1976d2 60%, #64b5f6 100%)",
              color: "#fff",
              boxShadow: "0 2px 8px rgba(30,144,255,0.08)",
              "&:hover": {
                background: "linear-gradient(90deg, #1565c0 60%, #1976d2 100%)",
              },
            }}
            onClick={() => setReportOpen(true)}
          >
            View report
          </Button>
          <VehicleRegistrationForm onSuccess={fetchVehicles} />
        </Stack>
      </Box>

      {/* Report dialog */}
      <VehicleReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        userId={userId ?? null}
      />
    </Box>
  );
};
