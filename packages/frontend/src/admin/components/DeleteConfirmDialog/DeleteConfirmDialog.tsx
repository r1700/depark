import React from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';

interface DeleteConfirmDialogProps {
  itemData: any;
  deletePath: string;
  onDeleteResult?: (result: { success: boolean; error?: string }) => void;
  open: boolean;
  onClose: () => void;
}

const DeleteConfirmDialog = ({
  itemData,
  deletePath,
  onDeleteResult,
  open,
  onClose
}: DeleteConfirmDialogProps) => {
  // Confirm and execute delete
  const confirmDelete = async () => {
    if (!itemData || !deletePath) return;
    const itemId = itemData.lotId || itemData.id;
    try {
      const response = await fetch(`${deletePath}/${itemId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (response.ok) {
        onClose();
        if (onDeleteResult) onDeleteResult({ success: true });
      } else {
        let errorMsg = 'מחיקה נכשלה';
        try {
          const errorData = await response.json();
          errorMsg = errorData.error || errorMsg;
        } catch {}
        onClose();
        if (onDeleteResult) onDeleteResult({ success: false, error: errorMsg });
      }
    } catch (error) {
      onClose();
      if (onDeleteResult) onDeleteResult({ success: false, error: 'שגיאת רשת במחיקה' });
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
          האם למחוק את
          <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
            "{itemData?.name || itemData?.id}"
          </Box>
          ?
        </Typography>
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            onClick={onClose}
          >
            ביטול
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmDelete}
          >
            מחק
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};

export default DeleteConfirmDialog;
