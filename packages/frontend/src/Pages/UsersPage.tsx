
import React from 'react';
import Sidebar from '../components/Menu/Sidebar';
import { Box, Typography, Button } from '@mui/material';

const UsersPage: React.FC = () => {
 
  const handleLogout = () => {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  };

  const user = {
    firstName: localStorage.getItem('firstName') ?? '',
    lastName: localStorage.getItem('lastName') ?? '',
  };

  return (
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
          Users
        </Typography>
       
        <Button
          variant="contained"
          color="primary"
          sx={{ marginRight: 2 }}
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
  );
};

export default UsersPage;
