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
import { VehicleRegistrationForm } from "./VehicleRegistrationForm";

// interface Vehicle {
//   id: string;
//   licensePlate: string;
//   model?: string;
//   location?: string;
//   dimensionOverrides?: {
//     length?: string;
//     weight?: string;
//     width?: string;
//     height?: string;
//   };
// }

// export const VehicleRow = () => {
//   const [vehicles, setVehicles] = useState<Vehicle[]>([]);
//   const [queuePosition, setQueuePosition] = useState<Record<string, number>>({});
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [reportOpen, setReportOpen] = useState(false);
  
//   const [userId, setUserId] = useState<string | null>(null);
  
//  useEffect(() => {
//   const userStr = localStorage.getItem('user');
//   let user= userStr ? JSON.parse(userStr) : null;

//   if (userStr !== null) {
//     try {
//       const user = JSON.parse(userStr);
//       if (user?.userId) {
//         setUserId(user.userId);
//       }
//     } catch (e) {
//       console.error("Failed to parse user from localStorage", e);
//     }
//   }
// }, []);

//   useEffect(() => {
//     if(userId)
//     fetchVehicles();
//   }, [userId]);

// const fetchVehicles = async () => {
// if (userId == null || userId === "" || userId === "null") {
// console.warn("No userId — skipping fetch");
// return;
// }

// try {
// const res = await fetch(`/api/vehicles/${userId}`);
// if (!res.ok) {
// const text = await res.text();
// throw new Error(text || "Server Error");
// }
// const data = await res.json();
// setVehicles(data);
// setCurrentIndex(data.length - 1);
// } catch (err) {
// console.error("Fetch error:", err);
// }
// };
 

//   const getVehicleCategory = (v: Vehicle) => {
//     const dims = v.dimensionOverrides;
//     if (!dims || !dims.length || !dims.weight) return "unknown";
//     const length = parseInt(dims.length);
//     const weight = parseInt(dims.weight);
//     if (length <= 4500 && weight <= 1300) return "private";
//     if (length <= 5000 && weight <= 2200) return "van";
//     if (length <= 7000 && weight <= 3500) return "truck_light";
//     return "unknown";
//   };

//   const iconForCategory = (category: string) => {
//     const iconProps = { sx: { fontSize: 80 } };
//     switch (category) {
//       case "private": return <DirectionsCarIcon {...iconProps} />;
//       case "van": return <AirportShuttleIcon {...iconProps} />;
//       case "truck_light": return <LocalTaxiIcon {...iconProps} />;
//       default: return <HelpOutlineIcon {...iconProps} />;
//     }
//   };

//   const vehicle = vehicles[currentIndex];
//   const category = vehicle ? getVehicleCategory(vehicle) : "unknown";
//   const icon = iconForCategory(category);

//   return (
//     <Box p={3} display="flex" flexDirection="column" alignItems="center">
//       <Typography variant="h4" sx={{ mb: 4 }}>
//         User vehicles
//       </Typography>

//       {vehicle && (
//         <Card
//           sx={{
//             p: 2,
//             width: 280,
//             height: 260,
//             textAlign: "center",
//             boxShadow: 4,
//             borderRadius: 3,
//             transition: "0.3s",
//             display: "flex",
//             flexDirection: "column",
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
//             {icon}
//             <Typography fontWeight="bold">{vehicle.model}</Typography>
//             <Typography fontSize="0.9rem">Plate: {vehicle.licensePlate}</Typography>
//             <Box width="100%">
//               <Button
//                 fullWidth
//                 size="small"
              
//                 sx={{ mt: 1, textTransform: 'none' }}
//                 variant="contained"
//               >
//                 Request
//               </Button>
//             </Box>
//             {queuePosition[vehicle.id] && (
//               <Alert severity="info" sx={{ mt: 1 }}>
//                 Queue: {queuePosition[vehicle.id]}
//               </Alert>
//             )}
//           </Stack>
//         </Card>
//       )}

//       <Box display="flex" justifyContent="center" gap={1} mt={2}>
//         {vehicles.map((_, idx) => (
//           <IconButton key={idx} onClick={() => setCurrentIndex(idx)}>
//             <FiberManualRecordIcon
//               fontSize="small"
//               color={idx === currentIndex ? "primary" : "disabled"}
//             />
//           </IconButton>
//         ))}
//       </Box>

//       <Box mt={3} width="100%" maxWidth={280}>
//         <Stack spacing={2}>
//           <Button
//             fullWidth
//             variant="contained"
//             sx={{ textTransform: 'none' }}
//             onClick={() => setReportOpen(true)}
//           >
//             View report
//           </Button>
//           <VehicleRegistrationForm onSuccess={fetchVehicles} />
//         </Stack>
//       </Box>

//       <VehicleReportDialog
//         open={reportOpen}
//         onClose={() => setReportOpen(false)}
        
//         userId={userId ?? null} 
//       />
//     </Box>
//   );
// };
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

export const VehicleRow = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [queuePosition, setQueuePosition] = useState<Record<string, number>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [reportOpen, setReportOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
    if (userId) fetchVehicles();
  }, [userId]);

  const fetchVehicles = async () => {
    if (!userId) {
      console.warn("No userId — skipping fetch");
      return;
    }
    try {
      const res = await fetch(`/api/vehicles/${userId}`);
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
  };

  const getVehicleCategory = (v: Vehicle) => {
    const dims = v.dimension_overrides;
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
      case "private": return <DirectionsCarIcon {...iconProps} />;
      case "van": return <AirportShuttleIcon {...iconProps} />;
      case "truck_light": return <LocalTaxiIcon {...iconProps} />;
      default: return <HelpOutlineIcon {...iconProps} />;
    }
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
            width: 280,
            height: 260,
            textAlign: "center",
            boxShadow: 4,
            borderRadius: 3,
            transition: "0.3s",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Stack spacing={1} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
            {icon}
            <Typography fontWeight="bold">{vehicle.model}</Typography>
            <Typography fontSize="0.9rem">Plate: {vehicle.license_plate}</Typography>
            <Box width="100%">
              <Button
                fullWidth
                size="small"
                sx={{ mt: 1, textTransform: 'none' }}
                variant="contained"
              >
                Request
              </Button>
            </Box>
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

      <Box mt={3} width="100%" maxWidth={280}>
        <Stack spacing={2}>
          <Button
            fullWidth
            variant="contained"
            sx={{ textTransform: 'none' }}
            onClick={() => setReportOpen(true)}
          >
            View report
          </Button>
          <VehicleRegistrationForm onSuccess={fetchVehicles} />
        </Stack>
      </Box>

      <VehicleReportDialog
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        userId={userId ?? null}
      />
    </Box>
  );
};