import React, { useState, useEffect } from "react";
import { Container, Paper, Typography, Box, Button, Stack } from "@mui/material";
import DataTable from "../components/table/table";

interface ParkingsPageProps {
  onEdit?: (lotId: string) => void;
  onAddNew?: () => void;
}

const ParkingsPage: React.FC<ParkingsPageProps> = ({ onEdit, onAddNew }) => {
  
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

  // State for delete confirmation dialog
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    lotData: any;
  }>({ open: false, lotData: null });

  // Fetch parking lots data
  const getAllParkingLots = async () => {
    try {
      console.log('🔄 FETCH_LOTS: Starting to fetch parking lots');
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
      console.log('🔄 FETCH_LOTS: Raw server response:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        const formattedData = result.parkingConfigs.map((config: any) => ({
          id: config.id || '',
          facilityName: config.facilityName || 'No Name'
        }));
        
        console.log('🔄 FETCH_LOTS: Formatted data for table:', JSON.stringify(formattedData, null, 2));
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

  // Handle edit - call onEdit prop if provided
  const handleEdit = (row: any) => {
    console.log('🔄 Editing lot:', row.id);
    if (onEdit) {
      onEdit(row.id);
    }
  };

  // Handle delete - show confirmation dialog first
  const handleDelete = (row: any) => {
    setDeleteConfirmDialog({ open: true, lotData: row });
  };

  // Confirm and execute delete
  const confirmDeleteLot = async () => {
    if (!deleteConfirmDialog.lotData) return;
    
    try {
      const response = await fetch(`/api/admin/${deleteConfirmDialog.lotData.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Remove from table immediately
        setTableData(prev => ({
          ...prev,
          rows: prev.rows.filter(r => r.id !== deleteConfirmDialog.lotData.id)
        }));
        console.log('✅ Parking lot deleted successfully');
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to delete:', errorData.error);
      }
    } catch (error) {
      console.error('❌ Error deleting parking lot:', error);
    } finally {
      // Close the dialog
      setDeleteConfirmDialog({ open: false, lotData: null });
    }
  };

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
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Button
              onClick={() => {
                console.log('🔄 Add New Lot clicked');
                if (onAddNew) {
                  onAddNew();
                }
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

        {/* Delete Confirmation Dialog */}
        {deleteConfirmDialog.open && (
          <Box
            sx={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              bgcolor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1600
            }}
          >
            <Box
              sx={{
                bgcolor: 'white',
                borderRadius: 2,
                p: 3,
                maxWidth: 400,
                width: '90%',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
              }}
            >
              <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#d32f2f' }}>
                ⚠️ Delete Parking Lot
              </Typography>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Are you sure you want to delete parking lot{' '}
                <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                  "{deleteConfirmDialog.lotData?.facilityName || deleteConfirmDialog.lotData?.id}"
                </Box>
                ?
              </Typography>
              <Stack direction="row" spacing={2} justifyContent="flex-end">
                <Button
                  variant="outlined"
                  onClick={() => setDeleteConfirmDialog({ open: false, lotData: null })}
                >
                  Cancel
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={confirmDeleteLot}
                >
                  Delete
                </Button>
              </Stack>
            </Box>
          </Box>
        )}
      </Paper>
    </Container>
  );
}

export default ParkingsPage;