import React, { useState } from 'react';
import { Button, Box, Typography, Modal, Fade, Backdrop } from '@mui/material';
// דוגמה: ייבוא קומפוננטות רלוונטיות
// import ReservedParkingForm from '../app/pages/reservedParking/ReservedParkingForm/ReservedParkingForm';
// import ReservedParkingTable from '../components/reservedParking/reservedParkingTable';

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

const ReservedParkingPage: React.FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);

  const openAddModal = () => setShowAddModal(true);
  const closeAddModal = () => setShowAddModal(false);

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
            Reserved Parking
          </Typography>

          <Button
            variant="contained"
            color="primary"
            sx={{ marginRight: 2 }}
            onClick={openAddModal}
          >
            Add Reserved Parking
          </Button>

          <Button
            variant="contained"
            color="primary"
          >
            Export to CSV
          </Button>

          {/* כאן תכניסי את הטבלה */}
          {/* <ReservedParkingTable /> */}
        </Box>
      </Box>

      <Modal
        open={showAddModal}
        onClose={closeAddModal}
        aria-labelledby="add-reserved-parking-modal-title"
        aria-describedby="add-reserved-parking-modal-description"
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
        <Fade in={showAddModal}>
          <Box sx={styleModal}>
            {/* <ReservedParkingForm onClose={closeAddModal} /> */}
          </Box>
        </Fade>
      </Modal>
    </>
  );
};

export default ReservedParkingPage;