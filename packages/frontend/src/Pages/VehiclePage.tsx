
import React, { useState } from 'react';
import Sidebar from '../components/Menu/Sidebar';
import { Vehicle } from '../app/types/Vehicle';
import {  Button, Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
import VehicleForm from '../app/pages/vehicle/VehicleForm/VehicleForm';



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

const VehiclePage: React.FC = () => {

const [showAddVehicleModal, setShowAddVehicleModal] = useState(false);

  const openAddVehicleModal = () => {
    setShowAddVehicleModal(true);
  };

  const closeAddVehicleModal = () => {    
    setShowAddVehicleModal(false);
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
      <Sidebar user={user} onLogout={handleLogout} />
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
          Vehicles
        </Typography>
       
        <Button
          variant="contained"
           onClick={openAddVehicleModal}
          color="primary"
          sx={{ marginRight: 2 }}
        >
          add vehicle
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
          open={showAddVehicleModal}
          onClose={closeAddVehicleModal}
          aria-labelledby="add-vehicle-modal-title"
          aria-describedby="add-vehicle-modal-description"
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
          <Fade in={showAddVehicleModal}>
            <Box sx={styleModal}>
              <VehicleForm
              onClose={closeAddVehicleModal}
              ></VehicleForm>
            </Box>
          </Fade>
        </Modal>
        </>
  );
};

export default VehiclePage;
