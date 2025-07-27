import React, { useState } from 'react';
import { Container, Button, Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
import UserList from '../Users/UserList';
import { User } from '../types/User';
import AddOrEditUserForm from '../Forms/UserForm';
import UserForm from '../Forms/UserForm';

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

const Home = () => {
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [viewUsersList, setViewUsersList] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const openAddUserModal = () => {
    setShowAddUserModal(true);
    setSelectedUser(null);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };

  return (
    <>
      <header className="App-header" style={{ padding: '1rem', backgroundColor: '#1565c0', color: '#fff' }}>
        <Typography variant="h4" component="h1" align="center">
          HR Management System
        </Typography>
      </header>
      <Container sx={{ mt: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            variant="contained"
            onClick={openAddUserModal}
            sx={{
              bgcolor: '#1565c0',
              '&:hover': { bgcolor: '#003c8f' },
              color: 'white',
              fontWeight: 'bold'
            }}
          >
            New User
          </Button>
          <Button
            variant="contained"
            onClick={() => setViewUsersList(true)}
            sx={{
              bgcolor: '#1565c0',
              '&:hover': { bgcolor: '#003c8f' },
              color: 'white',
              fontWeight: 'bold'
            }}
          > Users List</Button>
        </Box>

        {viewUsersList && <UserList />}

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
              ></UserForm>
            </Box>
          </Fade>
        </Modal>
      </Container>
    </>
  );
};

export default Home;