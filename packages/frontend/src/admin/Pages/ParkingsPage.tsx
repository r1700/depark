import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button } from "@mui/material";
import DataTable from "../components/table/table";
import { useNavigate } from "react-router-dom";
interface ParkingsPageProps {}
const ParkingsPage: React.FC<ParkingsPageProps> = () => {
  const navigate = useNavigate();
  const [tableData, setTableData] = useState<{
    columns: Array<{ id: string; label: string }>;
    rows: Array<any>;
  }>({
    columns: [
      { id: 'id', label: 'ID' },
      { id: 'facilityName', label: 'Facility Name' }
    ],
    rows: []
  });
  // Fetch parking lots data
  const getAllParkingLots = async () => {
    try {
      console.log(':arrows_counterclockwise: FETCH_LOTS: Starting to fetch parking lots');
      const response = await fetch('/api/admin/', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log(':arrows_counterclockwise: FETCH_LOTS: Raw server response:', JSON.stringify(result, null, 2));
      if (result.success) {
        const formattedData = result.parkingConfigs.map((config: any) => ({
          id: config.id || '',
          facilityName: config.facilityName || 'No Name'
        }));
        console.log(':arrows_counterclockwise: FETCH_LOTS: Formatted data for table:', JSON.stringify(formattedData, null, 2));
        return formattedData;
      } else {
        console.error('API returned error:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching parking lots:', error);
      return [];
    }
  };
  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      const parkingLots = await getAllParkingLots();
      setTableData(prev => ({ ...prev, rows: parkingLots || [] }));
    };
    loadData();
  }, []);
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {/* Header */}
        <Box textAlign="center" mb={4}>
          <Typography variant="h3" component="h1" gutterBottom sx={{
            fontWeight: 400,
            color: 'primary.main',
            borderBottom: '2px solid',
            borderColor: 'primary.main',
            pb: 2,
            mb: 4
          }}>
            Parking Lots Management
          </Typography>
        </Box>
        {/* Data Table */}
        <DataTable
          data={tableData}
          editPath="/admin-config"
          deletePath="/api/admin"
        />
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Button
              onClick={() => {
                console.log(':arrows_counterclockwise: Add New Lot clicked');
                navigate('/admin-config');
              }}
              sx={{ minWidth: 500,
                        bgcolor: 'primary.main',
                        color: 'white',
                        boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)',
                        borderRadius: 3,
                        fontWeight: 800,
                        letterSpacing: 1,
                        transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                        '&:hover': {
                          bgcolor: 'primary.dark',
                          boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
                          transform: 'translateY(-2px) scale(1.03)'
                        },
                        '&.Mui-disabled': {
                          bgcolor: 'grey.400',
                          color: 'white',
                          boxShadow: 'none',
                          opacity: 0.7
                        }
                      }}
            >
              + Add New Lot
            </Button>
          </Box>
      </Paper>
    </Container>
  );
}
export default ParkingsPage;