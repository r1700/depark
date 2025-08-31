import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAdminUsers, addAdminUser, updateAdminUser } from './adminUserSlice';
import DataTable from '../../../components/table/table';
import GenericForm, { FieldConfig } from '../../../components/forms/Form';
// import AddOrEditAdminUserForm from './AddAdminUser';
import { AdminUser, AdminUserFilters } from './adminUserTypes';
import { Box, CircularProgress, Typography, Button, Dialog, DialogContent } from '@mui/material';
import AdminUsersPageHeader from './AdminUsersPageHeader';

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(state => state.adminUsers.users ?? []);
  const loading = useAppSelector(state => state.adminUsers.loading);
  const error = useAppSelector(state => state.adminUsers.error);

  const [filters, setFilters] = useState<AdminUserFilters>({ limit: 20, offset: 0 });
  const [sortBy, setSortBy] = useState<string | undefined>();
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | undefined>();
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [isSortEnabled, setIsSortEnabled] = useState(false);
  const [isSortPanelOpen, setIsSortPanelOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  useEffect(() => {
    dispatch(fetchAdminUsers({
      ...(isFilterEnabled ? filters : { limit: 20, offset: 0 }),
      ...(isSortEnabled ? { sortBy, sortDirection } : {}),
    }));
  }, [dispatch, filters, sortBy, sortDirection, isFilterEnabled, isSortEnabled]);

  const openNew = () => { setSelectedUser(null); setFormMode('add'); setShowForm(true); };
  const openEdit = (user: AdminUser) => { setSelectedUser(user); setFormMode('edit'); setShowForm(true); };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedUser(null);
    dispatch(fetchAdminUsers({
      ...(isFilterEnabled ? filters : { limit: 20, offset: 0 }),
      ...(isSortEnabled ? { sortBy, sortDirection } : {}),
    }));
  };

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

  const fields: FieldConfig[] = [
    { name: 'id', label: 'ID', type: 'text', disabled: true },
    { name: 'email', label: 'Email', type: 'email', required: true },
    { name: 'firstName', label: 'First Name', type: 'text' },
    { name: 'lastName', label: 'Last Name', type: 'text' },
    { name: 'passwordHash', label: 'Password (leave empty to keep)', type: 'text' },
    { name: 'role', label: 'Role', type: 'select', options: [{ label: 'HR', value: 'hr' }, { label: 'Admin', value: 'admin' }], required: true },
    { name: 'perm_reportes', label: 'Permission: reportes', type: 'boolean' },
    { name: 'perm_admin', label: 'Permission: admin', type: 'boolean' },
    { name: 'perm_vehicle', label: 'Permission: vehicle', type: 'boolean' },
    { name: 'lastLoginAt', label: 'Last Login At', type: 'text', disabled: true },
  ];

  const initialState = useMemo(() => ({
    id: undefined,
    email: '',
    firstName: '',
    lastName: '',
    passwordHash: '',
    role: 'hr',
    perm_reportes: false,
    perm_admin: false,
    perm_vehicle: false,
    lastLoginAt: null,
  }), []);
  const rows = (users ?? []).map(user => {
    const perms = user.permissions ?? [];
    return {
      id: user.id,
      email: user.baseUser?.email ?? '',
      firstName: user.baseUser?.firstName ?? '',
      lastName: user.baseUser?.lastName ?? '',
      passwordHash: '',
      role: user.role ?? 'hr',
      perm_reportes: perms.includes('reportes'),
      perm_admin: perms.includes('admin'),
      perm_vehicle: perms.includes('vehicle'),
      lastLoginAt: user.lastLoginAt ?? null,
      permissions: (user.permissions || []).join(', '),
      createdAt: user.baseUser?.createdAt ? new Date(user.baseUser.createdAt).toLocaleDateString() : '',
      updatedAt: user.baseUser?.updatedAt ? new Date(user.baseUser.updatedAt).toLocaleDateString() : '',
    };
  });

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

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button variant="contained" onClick={openNew}>Add Admin User</Button>
      </Box>

      {!loading && !error && (
        users.length > 0
          ? <DataTable
            data={{ columns, rows }}
            onRowClick={(row: any) => {
              const u = users.find((x: AdminUser) => x.id === row.id);
              if (u) openEdit(u);
            }}
            title="Admin Users"
            fields={fields}
            onSubmit={async (data: any) => {}}
          />
          : <Typography>No users found</Typography>
      )}

      <Dialog open={showForm} onClose={handleCloseForm} maxWidth="sm" fullWidth>
        <DialogContent>
          {/* <AddOrEditAdminUserForm
            entityToEdit={selectedUser ?? undefined}
            onClose={handleCloseForm}
            mode={formMode}
          /> */}
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AdminUsersPage;