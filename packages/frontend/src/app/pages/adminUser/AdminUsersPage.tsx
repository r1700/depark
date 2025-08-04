// src/pages/AdminUsersPage.tsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminUsers } from './adminUserSlice';
import { AppDispatch, RootState } from './store';  // ייבוא AppDispatch
import { Box, Typography, CircularProgress } from '@mui/material';

const AdminUsersPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();  // טיפוס נכון ל-dispatch

  const { users, loading, error } = useSelector((state: RootState) => state.adminUsers);

  useEffect(() => {
    dispatch(fetchAdminUsers({}));  // שלח אובייקט ריק אם אין פילטרים
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Admin Users
      </Typography>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.name} - {user.email}
          </li>
        ))}
      </ul>
    </Box>
  );
};

export default AdminUsersPage;
