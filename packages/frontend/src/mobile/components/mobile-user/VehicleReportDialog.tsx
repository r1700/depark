

import React, { useState, useEffect, useCallback } from "react";
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

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);


interface ReportData {
  totalTime: number;
  averageTime: number;
  averageWaitTime: number;
  vehicles: {
    licensePlate: string;
    totalTime: number;
    averageTime: number;
    averageWaitTime: number;
    records: { timestamp: string; count: number }[];
  }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
  
  userId: string | null;
}


const formatDuration = (minutes: number): string => {
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return `${h}h ${m}m`;
};


const minutesToHours = (minutes: number): number => {
  return Math.floor(minutes / 60); 
};

export const VehicleReportDialog = ({ open, onClose, userId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      ;
const response = await fetch(`/api/report/${encodeURIComponent(userId || '')}`);      if (!response.ok) {
        const errRes = await response.json().catch(() => ({}));
        throw new Error(errRes.message || "Failed to fetch report data");
      }
      const data = await response.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (open) {
      fetchReport();
    } else {
      setReport(null);
      setError("");
      setLoading(false);
    }
  }, [open, fetchReport]);

 
  const getTotalTimeGraph = () => {
    return (
      <Bar
        style={{ marginTop: 30 }}
        data={{
          labels: report?.vehicles.map((vehicle) => vehicle.licensePlate), 
          datasets: [
            {
              label: "Total Parking Time (in hours)", 
              data: report?.vehicles.map((vehicle) => minutesToHours(vehicle.totalTime)), 
              backgroundColor: "rgba(53, 162, 235, 0.5)",
              borderColor: "rgba(53, 162, 235, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            title: {
              display: true,
              text: "Total Parking Time per Vehicle (in hours)", 
            },
            tooltip: { enabled: true },
          },
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1, 
              },
            },
          },
        }}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen
      PaperProps={{
        sx: {
          display: "flex",
          flexDirection: "column",
          height: "100%",
        },
      }}
    >
      <DialogTitle>Vehicle Report</DialogTitle>

      <DialogContent
        sx={{
          flex: 1,
          overflowY: "auto",
          px: 1,
        }}
      >
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : report?.vehicles?.length ? (
          <>
            <Table size="small" sx={{ width: "100%" }}>
              <TableHead>
                <TableRow>
                  <TableCell>License</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Avg Park</TableCell>
                  <TableCell>Avg Wait</TableCell>
                  <TableCell>Records</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.vehicles.map((v, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{v.licensePlate}</TableCell>
                    <TableCell>{formatDuration(v.totalTime)}</TableCell>
                    <TableCell>{formatDuration(v.averageTime)}</TableCell>
                    <TableCell>{formatDuration(v.averageWaitTime)}</TableCell>
                    <TableCell>{v.records.length}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {getTotalTimeGraph()}
          </>
        ) : (
          <Typography>No data to display.</Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 1 }}>
        <Button fullWidth onClick={onClose}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

