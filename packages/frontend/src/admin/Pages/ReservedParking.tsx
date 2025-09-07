import React, { useEffect, useState } from "react";
import { Container, Paper, Typography, Box, Button, Drawer, Switch, FormControlLabel } from "@mui/material";

import FilterListIcon from '@mui/icons-material/FilterList';
import DataTable from "../components/table/table";
import FilterPanel, { FieldConfigGeneric } from "../components/filter-panel/FilterPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";



const filterFields: FieldConfigGeneric<any>[] = [
  { name: "email", label: "User Email", type: "free" },
  { name: "parking_number", label: "Parking Number", type: "free" },
  { name: "day_of_week", label: "Day of Week", type: "select", options: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"] },
];



const ReservedParkingPage: React.FC = () => {
  const navigate = useNavigate();

  const [reservedParking, setReservedParking] = useState<any[]>([]);
  const [editUserEmail, setEditUserEmail] = useState<string>("");
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);


  const fetchReservedParking = async () => {
    try {
      const params: any = {};
      if (isFilterEnabled) {
        if (filters.email) params.email = filters.email;
        if (filters.parking_number) params.parking_number = filters.parking_number;
        if (filters.day_of_week) params.day_of_week = filters.day_of_week;
      }
      console.log({ params });

      const response = await axios.get("/api/reservedparking", { params });
      setReservedParking(response.data.results || response.data);
    } catch (error) {
      console.error("Failed to fetch reserved parking:", error);
    }
  };

  useEffect(() => {
    fetchReservedParking();
    // eslint-disable-next-line
  }, [filters, isFilterEnabled]);

  const formatDate = (value: string | undefined | null) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().slice(0, 10);
  };

  const tableData = {
    columns: [
      { id: "baseuser_id", label: "User ID" },
      { id: "parking_number", label: "Parking Number" },
      { id: "day_of_week", label: "Day of Week" },
      { id: "createdAt", label: "Created At" },
      { id: "updatedAt", label: "Updated At" }
    ],
    rows: (reservedParking || []).map((r: any) => ({
      ...r,
      createdAt: formatDate(r.createdat ?? r.createdAt),
      updatedAt: formatDate(r.updatedat ?? r.updatedAt)
    }))
  };

  const handleExportToCSV = () => {
    if (!tableData.rows.length) return;
    const columns = tableData.columns.map(col => col.label);
    const csvRows = [
      columns.join(","),
      ...tableData.rows.map(row =>
        columns.map(label => {
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

  const handleEdit = (row: any) => {
    navigate(`/admin/layout/admin-config-reservedparking`, { state: row });
  };


  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Box
          mb={4}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-start",
            minHeight: 80,
          }}
        >
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-start" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FilterListIcon />}
              onClick={() => setDrawerOpen(true)}
              sx={{
                mb: 1,
                height: 40,
                borderColor: "primary.main",
                color: "primary.main",
                bgcolor: "background.paper",
                boxShadow: 1,
                fontWeight: 500,
              }}
            >
              Filter
            </Button>
            <FormControlLabel
              sx={{ mt: 1 }}
              label={isFilterEnabled ? 'Filter: ON' : 'Filter: OFF'}
              control={
                <Switch
                  checked={isFilterEnabled}
                  onChange={() => setIsFilterEnabled(prev => !prev)}
                  color="primary"
                />
              }
            />
          </Box>
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 400,
              color: "primary.main",
              borderBottom: "2px solid",
              borderColor: "primary.main",
              pb: 2,
              mb: 4,
              flex: 1,
              textAlign: "center",
            }}
          >
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
              navigate("/admin/layout/admin-config-reservedparking");
            }}
          >
            + Add Reserved Parking
          </Button>
        </Box>
        <Drawer anchor="right" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
          <Box sx={{ width: 320, p: 2 }}>
            <FilterPanel
              fields={filterFields}
              filters={filters}
              onChange={setFilters}
              onClear={() => setFilters({})}
            />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => setDrawerOpen(false)}
              fullWidth
            >
              close
            </Button>
          </Box>
        </Drawer>

        <DataTable
          data={tableData}
          title="Reserved Parking"
          initialState={{
            email: editUserEmail,
            parking_number: "",
            day_of_week: "",
          }}
          onRowClick={(row) => {
            setEditUserEmail(row.email || "");
          }}
          onEdit={handleEdit}
          showEdit={true}
          showDelete={true}
          deletePath="/api/reservedparking"
        />
      </Paper>
    </Container>
  );
};

export default ReservedParkingPage;