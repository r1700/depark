import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

interface DeleteConfirmDialogProps {
  itemData: any;
  deletePath: string;
  onDeleteSuccess?: () => void;
}

export interface DeleteConfirmDialogRef {
  openDialog: () => void;
}

const DeleteConfirmDialog = forwardRef<DeleteConfirmDialogRef, DeleteConfirmDialogProps>(({
  itemData,
  deletePath,
  onDeleteSuccess
}, ref) => {
  const [open, setOpen] = useState(false);

  // Function to open the dialog
  const openDialog = () => {
    setOpen(true);
  };

  // Function to close the dialog
  const closeDialog = () => {
    setOpen(false);
  };

  // Expose openDialog to parent component
  useImperativeHandle(ref, () => ({
    openDialog
  }));
  // Confirm and execute delete
  const confirmDelete = async () => {
    if (!itemData || !deletePath) return;
    
    try {
      const response = await fetch(`${deletePath}/${itemData.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        console.log('✅ Item deleted successfully');
        closeDialog();
        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          // Default behavior - refresh page
          window.location.reload();
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to delete:', errorData.error);
      }
    } catch (error) {
      console.error('❌ Error deleting item:', error);
    }
  };

  if (!open) return null;

  return (
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
          ⚠️ Delete Confirmation
        </Typography>
        <Typography variant="body1" sx={{ mb: 3 }}>
          Are you sure you want to delete{' '}
          <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
            "{itemData?.facilityName || itemData?.name || itemData?.id}"
          </Box>
          ?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={closeDialog}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            Delete
          </Button>
        </Stack>
      </Box>
    </Box>
  );
});

export default DeleteConfirmDialog;
