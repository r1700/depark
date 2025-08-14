import React, { useState } from 'react';
import { Button, Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
import UserForm from '../app/pages/user/UserForm/UserForm';
import DataTable from '../components/table/table';

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

const userTableData = {
  columns: [
    { id: "id", label: "ID" },
    { id: "user", label: "User" },
    { id: "activity", label: "Activity" },
  ],
  rows: [
    { id: 1, user: "John", activity: "Enter" },
    { id: 2, user: "Jane", activity: "Exit" },
  ]
};

const UsersPage: React.FC = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);

  const openAddUserModal = () => {
    setShowAddUserModal(true);
    setShowUserTable(false);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  const toggleUserTable = () => {
    setShowUserTable(prev => !prev);
    setShowAddUserModal(false);
  }

  const handleLogout = () => {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  };

  const user = {
    firstName: localStorage.getItem('firstName') ?? '',
    lastName: localStorage.getItem('lastName') ?? '',
  };

  return (
    <>
      <Box sx={{ display: 'flex' }}>
        <Box sx={{ flexGrow: 1, p: 3 }}>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              color: '#1976d2',
              marginBottom: 3,
              textAlign: 'center',
            }}
          >
            Users
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={openAddUserModal}
          >
            Add User
          </Button>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={toggleUserTable}
          >
            {showUserTable ? "Hide Users" : "Show Users"}
          </Button>

          <Button
            variant="contained"
            color="primary"
          >
            Export to CSV
          </Button>
        </Box>
      </Box>

      {showUserTable && <DataTable data={userTableData} />}

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
            <UserForm
              onClose={closeAddUserModal}
            />
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default UsersPage;