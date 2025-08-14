import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAdminUsers } from './adminUserSlice';
import DataTable from '../../../components/table/table';
import { AdminUserFilters } from './adminUserTypes';
import { Box, CircularProgress, Typography } from '@mui/material';
import AdminUsersPageHeader from './AdminUsersPageHeader';

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(state => state.adminUsers.users);
  const loading = useAppSelector(state => state.adminUsers.loading);
  const error = useAppSelector(state => state.adminUsers.error);

  const [filters, setFilters] = useState<AdminUserFilters>({ limit: 20, offset: 0 });
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();

  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [isSortEnabled, setIsSortEnabled] = useState(false);

  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false); // לא בשימוש ישירות, אבל מוכן אם תפעילי בעתיד

  useEffect(() => {
    const params = {
      ...(isFilterEnabled ? filters : { limit: 20, offset: 0 }),
      ...(isSortEnabled ? { sortBy, sortDirection } : {}),
    };
dispatch(fetchAdminUsers({
  ...(isFilterEnabled ? filters : { limit: 20, offset: 0 }),
  ...(isSortEnabled ? { sortBy, sortDirection } : {}),
}));  }, [dispatch, filters, sortBy, sortDirection, isFilterEnabled, isSortEnabled]);

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'email', label: 'Email' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'role', label: 'Role' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'lastLoginAt', label: 'Last Login' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'updatedAt', label: 'Updated At' },
  ];

  const rows = users.map(user => ({
    id: user.id,
    email: user.baseUser.email,
    firstName: user.baseUser.firstName,
    lastName: user.baseUser.lastName,
    role: user.role,
    permissions: user.permissions.join(', '),
    lastLoginAt: user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString() : 'Never',
    createdAt: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '',
    updatedAt: user.updatedAt ? new Date(user.updatedAt).toLocaleDateString() : '',
  }));

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <AdminUsersPageHeader
        isFilterEnabled={isFilterEnabled}
        setIsFilterEnabled={setIsFilterEnabled}
        isSortEnabled={isSortEnabled}
        setIsSortEnabled={setIsSortEnabled}
        isSortPanelOpen={isSortPanelOpen}
        setIsSortPanelOpen={setIsSortPanelOpen}
        filters={filters}
        setFilters={setFilters}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortDirection={sortDirection}
        setSortDirection={setSortDirection}
      />

      {!loading && !error && (users.length > 0 ? <DataTable data={{ columns, rows }} /> : <Typography>No users found</Typography>)}
    </Box>
  );
};

export default AdminUsersPage;