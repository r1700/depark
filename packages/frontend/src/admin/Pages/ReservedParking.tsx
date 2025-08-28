import React, { useEffect } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import DataTable from "../components/table/table";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAppDispatch } from "../app/store";
import { fetchReservedParking } from "../app/pages/reservedparking/reservedparkingThunks";
import { RootState } from "../app/store";

const ReservedParkingPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // קבלת נתונים מה-store
  const reservedParking = useSelector((state: RootState) => state.reservedParking.reservedParking);

  useEffect(() => {
    dispatch(fetchReservedParking());
  }, [dispatch]);

  // מאזין לאירוע גלובלי שמודיע על מחיקה (ראה שינוי ב‑DeleteConfirmDialog)
  useEffect(() => {
    const handler = (e: Event) => {
      dispatch(fetchReservedParking());
    };
    window.addEventListener('reservedParkingDeleted', handler);
    return () => window.removeEventListener('reservedParkingDeleted', handler);
  }, [dispatch]);

  // פונקציה לפורמט תאריך: מחזירה YYYY-MM-DD (רק התאריך, בלי זמן)
  const formatDate = (value: string | undefined | null) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10); // YYYY-MM-DD
  };

  // הכנת השורות לטבלה — ממירים את created/updated לשדות createdAt ו-updatedAt כפורמט תאריך בלבד
  const rows = (reservedParking || []).map((r: any) => ({
    ...r,
    createdAt: formatDate(r.createdat ?? r.createdAt),
    updatedAt: formatDate(r.updatedat ?? r.updatedAt)
  }));

  const tableData = {
    columns: [
      { id: "baseuser_id", label: "User ID" },
      { id: "parking_number", label: "Parking Number" },
      { id: "day_of_week", label: "Day of Week" },
      { id: "createdAt", label: "Created At" },
      { id: "updatedAt", label: "Updated At" }
    ],
    rows
  };

  // --- Export to CSV ---
  const handleExportToCSV = () => {
    if (!rows.length) return;
    const columns = tableData.columns.map(col => col.label);
    const csvRows = [
      columns.join(","),
      ...rows.map(row =>
        columns.map(label => {
          // find the column id by label
          const col = tableData.columns.find(c => c.label === label);
          return `"${row[col?.id ?? ""] ?? ""}"`;
        }).join(",")
      )
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "reserved_parking.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            fontWeight: 400,
            color: "primary.main",
            borderBottom: "2px solid",
            borderColor: "primary.main",
            pb: 2,
            mb: 4
          }}>
            Reserved Parking Management
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleExportToCSV}
          >
            Export to CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/admin-config-reservedparking");
            }}
          >
            + Add Reserved Parking
          </Button>
        </Box>
        <DataTable
          data={tableData}
          editPath="/admin-config-reservedparking"
          deletePath="/api/reservedparking"
        />
      </Paper>
    </Container>
     );
};

export default ReservedParkingPage;