import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DataTable from "../components/table/table";

interface ParkingsPageProps {}

const ParkingsPage: React.FC<ParkingsPageProps> = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<{
    columns: Array<{ id: string; label: string }>;
    rows: Array<any>;
  }>({
    columns: [
      { id: "id", label: "ID" },
      { id: "facilityName", label: "Facility Name" },
    ],
    rows: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/admin/", {
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => {
        if (res.status === 401) {
          console.warn("Unauthorized - redirecting to login");
          navigate("/login");
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setTableData((prev) => ({
            ...prev,
            rows: data.parkingConfigs || [],
          }));
        }
      })
      .catch((err) => {
        console.error("Failed to fetch parking lots:", err);
      });
  }, [navigate]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
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
            }}
          >
            Parking Lots Management
          </Typography>
        </Box>

        {/* Data Table */}
        <DataTable
          data={tableData}
          deletePath="/api/admin"
          showEdit={true}
          showDelete={true}
          fields={[
            { name: "facilityName", label: "Facility Name", type: "text", required: true },
            // ניתן להוסיף כאן שדות נוספים לפי הצורך
          ]}
          onRowClick={(row) => {
            if (row.lotId || row.id) {

              // Prefer lotId if exists, else fallback to id


              navigate(`/admin-config/${row.lotId || row.id}`);

              navigate(`/admin/layout/admin-config/${row.lotId || row.id}`);
            }
          }}
          onEdit={(row) => {
            navigate(`/admin/layout/admin-config/${row.lotId || row.id}`);
          }}
          onSubmit={async (updated) => {
            const token = localStorage.getItem("token");
            try {
              const response = await fetch(`/api/admin/${updated.id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: token ? `Bearer ${token}` : "",
                },
                body: JSON.stringify({ parkingConfig: updated }),
              });
              if (response.ok) {
                setTableData((prev) => ({
                  ...prev,
                  rows: prev.rows.map((row) => row.id === updated.id ? updated : row),
                }));
              } else {
                alert("Failed to update parking lot");
              }
            } catch (err) {
              alert("Error updating parking lot");
            }
          }}
        />

        <Box sx={{ textAlign: "center", mb: 6 }}>
          <Button
            onClick={() => {
              console.log("Add New Lot clicked");
              navigate("/admin/layout/admin-config");
            }}
            sx={{
              minWidth: 500,
              bgcolor: "primary.main",
              color: "white",
              boxShadow: "0 4px 16px rgba(25, 118, 210, 0.10)",
              borderRadius: 3,
              fontWeight: 800,
              letterSpacing: 1,
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              "&:hover": {
                bgcolor: "primary.dark",
                boxShadow: "0 8px 32px rgba(25, 118, 210, 0.18)",
                transform: "translateY(-2px) scale(1.03)",
              },
              "&.Mui-disabled": {
                bgcolor: "grey.400",
                color: "white",
                boxShadow: "none",
                opacity: 0.7,
              },
            }}
          >
            + Add New Lot
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ParkingsPage;
