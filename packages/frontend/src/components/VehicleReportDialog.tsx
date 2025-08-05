import React, { useState, useEffect, useCallback } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, CircularProgress, Alert,
  Typography, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS, CategoryScale, LinearScale,
  BarElement, Title, Tooltip,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

interface ReportData {
  totalTime: number;
  averageTime: number;
  averageWaitTime: number;
  peakHours: { hour: string; count: number }[];
}

interface Props {
  open: boolean;
  onClose: () => void;
   userId: string | null;
}

// פונקציה לפורמט דיוק זמן מדקות ל-Xh Ym או Xm
const formatDuration = (minutes: number): string => {
  if (!minutes || isNaN(minutes) || minutes <= 0) return "0m";
  if (minutes < 60) {
    return `${Math.round(minutes)}m`;
  }
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
};

export const VehicleReportDialog = ({ open, onClose, userId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<ReportData | null>(null);
  const [error, setError] = useState("");

  const fetchReport = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`/api/report?userId=${encodeURIComponent(userId || '')}`);
      if (!response.ok) throw new Error("Failed to fetch report data");
      const data: ReportData = await response.json();
      setReport(data);
    } catch (err: any) {
      setError(err.message || "Error fetching report data");
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


  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Vehicle Report</DialogTitle>
      <DialogContent dividers>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : report ? (
          <>
            <Typography variant="h6" gutterBottom>
              Total Parking Time: {formatDuration(report.totalTime)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Average Parking Time: {formatDuration(report.averageTime)}
            </Typography>
            <Typography variant="h6" gutterBottom>
              Average Wait Time: {formatDuration(report.averageWaitTime)}
            </Typography>

            <Table size="small" aria-label="Peak hours">
              <TableHead>
                <TableRow>
                  <TableCell>Hour</TableCell>
                  <TableCell>Count</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.peakHours.map((row, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{row.hour}</TableCell>
                    <TableCell>{row.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div style={{ marginTop: 20 }}>
              <Bar
                data={{
                  labels: report.peakHours.map(h => h.hour),
                  datasets: [{
                    label: "Peak Hours",
                    data: report.peakHours.map(h => h.count),
                    backgroundColor: "rgba(75, 192, 192, 0.2)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                  }],
                }}
                options={{
                  responsive: true,
                  plugins: {
                    title: { display: true, text: "Peak Hour Distribution" },
                    tooltip: { enabled: true },
                  },
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { stepSize: 1 }
                    }
                  }
                }}
              />
            </div>
          </>
        ) : (
          <Typography>No data to display.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};