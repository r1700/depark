import React, { useEffect, useState } from "react";
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Drawer,
  Switch,
  FormControlLabel,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import DataTable from "../components/table/table";
import FilterPanel, {
  FieldConfigGeneric,
} from "../components/filter-panel/FilterPanel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { numberToStatus } from "../../utils/statusMapper";

const API_BASE= process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const filterFields: FieldConfigGeneric<any>[] = [

  { name: "email", label: "Email", type: "free" },
  { name: "phone", label: "Phone", type: "free" },
  { name: "freeSearch", label: "Free Search", type: "free" },
  {
    name: "department", label: "Department", type: "select",
    options: ['Sales', 'Marketing', 'Engineering', 'HR'],
    multi: true
  },
  { name: "max_cars_allowed_parking", label: "Max Cars Allowed", type: "free" },
  {
    name: "status",
    label: "Status",
    type: "select",
    options: ['pending', 'approved', 'declined', 'suspended'],
  },
  {
    name: "created_by", label: "Created By", type: "select",
    options: ['admin', 'HR'],
  },
  {
    name: "approved_by", label: "Approved By", type: "select",
    options: ['admin', 'HR'],
  },
  { name: "approved_at", label: "Approved At", type: "date" },
];

const UsersPage: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState<any[]>([]);
  const [filters, setFilters] = useState<{ [key: string]: any }>({});
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isFilterEnabled, setIsFilterEnabled] = useState(true);

  // ...existing code...
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const params: any = {};
        if (isFilterEnabled) {
          Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== "") {
              if (Array.isArray(value)) {
                params[key] = value.join(',');
              } else {
                params[key] = value;
              }
            }
          });
        }
        const response = await axios.get(`${API_BASE}/api/users`, { params });
        setUsers(response.data.results || response.data);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, [filters, isFilterEnabled]);


  const tableData = {
    columns: [
      { id: "fullName", label: "Full Name" },
      { id: "email", label: "Email" },
      { id: "phone", label: "Phone" },
      { id: "department", label: "Department" },
      { id: "employee_id", label: "Employee ID" },
      { id: "status", label: "Status" },
      { id: "max_cars_allowed_parking", label: "Max Cars Allowed" },
      { id: "created_by", label: "Created By" },
      { id: "approved_by", label: "Approved By" },
      { id: "approved_at", label: "Approved At" },
    ],
    rows: (users || []).map((user: any): Record<string, any> => ({
      id: user.baseuser_id,
      baseuser_id: user.baseuser_id,
      fullName: `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim(),
      email: user.email,
      phone: user.phone ?? "-",
      department: user.department ?? "-",
      employee_id: user.employee_id ?? "-",
      status: numberToStatus(user.status),
      max_cars_allowed_parking: user.max_cars_allowed_parking ?? "-",
      created_by: user.created_by ?? "-",
      approved_by: user.approved_by ?? "-",
      approved_at: user.approved_at
        ? new Date(user.approved_at).toLocaleDateString()
        : "-",
      _original: user,
    })),
  };

  const handleExportToCSV = () => {
    if (!tableData.rows.length) return;
    const columns = tableData.columns.map((col) => col.label);
    const csvRows = [
      columns.join(","),
      ...tableData.rows.map((row) =>
        columns
          .map((label) => {
            const col = tableData.columns.find((c) => c.label === label);
            return `"${row[col?.id ?? ""] ?? ""}"`;
          })
          .join(",")
      ),
    ];
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "users.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleEdit = (row: any) => {
    console.log("Going to edit user with data:", row._original || row);
    navigate("/admin/layout/add-user", { state: row._original || row });
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
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
              label={isFilterEnabled ? "Filter: ON" : "Filter: OFF"}
              control={
                <Switch
                  checked={isFilterEnabled}
                  onChange={() => setIsFilterEnabled((prev) => !prev)}
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
            Users Management
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <Button variant="contained" color="primary" onClick={handleExportToCSV}>
            Export to CSV
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              navigate("/admin/layout/add-user");
            }}
          >
            + Add User
          </Button>
        </Box>
        <Drawer
          anchor="right"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
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
          title="Users"
          onEdit={handleEdit}
          showEdit={true}
          showDelete={true}
          deletePath={`${API_BASE}/api/users`}
        />
      </Paper>
    </Container>
  );
};

export default UsersPage;
