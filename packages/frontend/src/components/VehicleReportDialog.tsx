import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

interface Vehicle {
  id: number;
  licensePlate: string;
  model: string;
  location: string;
}
interface Props {
  open: boolean;
  onClose: () => void;
  userId: string;
}
interface ReportData {
  totalTime: number;
  averageTime: number;
  averageWaitTime: number;
  peakHours: { hour: string; count: number }[];
}

export const VehicleReportDialog = ({ open, onClose, userId }: Props) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`/api/vehicles?userId=${userId}`);
        setVehicles(res.data);
        // דוגמה לדו"ח
        const totalTime = res.data.length * 120;
        const averageTime = totalTime / res.data.length;
        const averageWaitTime = 10;
        const peakHours = [
          { hour: "9 AM", count: 5 },
          { hour: "12 PM", count: 8 },
          { hour: "6 PM", count: 6 },
        ];
        setReport({ totalTime, averageTime, averageWaitTime, peakHours });
        setError("");
      } catch (err) {
        setError("Failed to fetch vehicles");
      }
      setLoading(false);
    };
    if (open) {
      fetchVehicles();
    }
  }, [open, userId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Vehicle Report</DialogTitle>
      <DialogContent>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : report ? (
          <>
            {/* Report Data */}
            <Typography>Total Time: {report.totalTime}</Typography>
            <Typography>Average Time: {report.averageTime}</Typography>
            <Typography>Average Wait Time: {report.averageWaitTime}</Typography>
            {/* הצגת רכבים */}
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Model</TableCell>
                  <TableCell>Plate</TableCell>
                  <TableCell>Location</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {vehicles.map((v) => (
                  <TableRow key={v.id}>
                    <TableCell>{v.model}</TableCell>
                    <TableCell>{v.licensePlate}</TableCell>
                    <TableCell>{v.location}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        ) : null}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};