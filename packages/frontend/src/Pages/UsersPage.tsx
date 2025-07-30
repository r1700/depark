
import React, { useState } from 'react';
import { Button, Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
import UserForm from '../app/pages/user/UserForm/UserForm';



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

const [showAddUserModal, setShowAddUserModal] = useState(false);

  const openAddUserModal = () => {
    setShowAddUserModal(true);
  };

  const closeAddUserModal = () => {
    setShowAddUserModal(false);
  };



  const handleLogout = () => {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  };

  const user = {
    firstName: localStorage.getItem('firstName') ?? '',
    lastName: localStorage.getItem('lastName') ?? '',
  };

  return (<>
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
          add user
        </Button>

        
        <Button
          variant="contained" 
          color="primary" 
        >
          export to CSV
        </Button>
      </Box>
    </Box>



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
        </>
  );
};

export default UsersPage;



