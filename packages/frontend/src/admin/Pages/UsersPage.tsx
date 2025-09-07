import React, { useState } from 'react';
import { Button, Box, Typography, Modal, Fade, Backdrop, Snackbar, Alert } from '@mui/material';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../app/store';
import { uploadCsvFile } from '../app/pages/user/userThunks';
import UserForm from '../app/pages/user/UserForm/UserForm';

import UsersTable from '../app/pages/user/UserTable/userTable'; // ← הייבוא החדש

const styleModal = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  borderRadius: 2,
  p: 4,
  width: { xs: '90%', sm: 400 },
  align: 'center',
};

const UsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [showAddUserModal, setShowAddUserModal] = useState(false);

  // נוסיף state להודעת הצלחה/שגיאה
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const openAddUserModal = () => setShowAddUserModal(true);
  const closeAddUserModal = () => setShowAddUserModal(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      console.log("📂 נבחר קובץ:", selectedFile.name);

      try {
        // Thunk מחזיר הבטחה – נחכה לתוצאה
        await dispatch(uploadCsvFile(selectedFile)).unwrap();

        setSnackbar({
          open: true,
          message: " הנתונים הועלו בהצלחה",
          severity: 'success',
        });
      } catch (err: any) {
        setSnackbar({
          open: true,
          message: " שגיאה בהעלאת הנתונים: " + (err.message || ''),
          severity: 'error',
        });
      }
    }
  };

  return (
    <>
      <Box sx={{ p: 2 }}>
        <Typography variant="h4" gutterBottom>
          ניהול משתמשים
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={openAddUserModal}
          >
            הוסף משתמש
          </Button>
          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
          >
            export to CSV
          </Button>
          {/* כפתור בחירת קובץ CSV */}
          <Button
            variant="contained"
            color="primary"
            component="label"
            sx={{ marginRight: 2 }}
          >
            import from CSV
            <input
              type="file"
              accept=".csv"
              hidden
              onChange={handleFileChange}
            />
          </Button>
        </Box>
        {/* טבלת המשתמשים */}
        <UsersTable />
      </Box>

      {/* Modal להוספת משתמש */}
      <Modal
        open={showAddUserModal}
        onClose={closeAddUserModal}
        aria-labelledby="add-user-modal-title"
        aria-describedby="add-user-modal-description"
        closeAfterTransition
        keepMounted
        slots={{ backdrop: Backdrop }}
        slotProps={{
          backdrop: {
            timeout: 500,
            sx: { backgroundColor: 'transparent' }
          },
        }}
      >
        <Fade in={showAddUserModal}>
          <Box sx={styleModal}>
            <UserForm onClose={closeAddUserModal} />
          </Box>
        </Fade>
      </Modal>

      {/* Snackbar לפידבק */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UsersPage;
