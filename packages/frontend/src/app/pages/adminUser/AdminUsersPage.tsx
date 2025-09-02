import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store';
import { fetchAdminUsers, addAdminUser, updateAdminUser } from './adminUserSlice';
import DataTable from '../../../components/table/table';
import GenericForm, { FieldConfig } from '../../../components/forms/Form';
import { AdminUser, AdminUserFilters } from './adminUserTypes';
import { Box, CircularProgress, Typography, Button, Dialog, DialogContent } from '@mui/material';
import AdminUsersPageHeader from './AdminUsersPageHeader';

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const users = useAppSelector(state => state.adminUsers.users ?? []);
  const loading = useAppSelector(state => state.adminUsers.loading);
  const error = useAppSelector(state => state.adminUsers.error);
  const [filters, setFilters] = useState<AdminUserFilters>({ limit: 20, offset: 0 });
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<'add' | 'edit'>('add');

  const refreshUsers = useCallback(() => {
    dispatch(fetchAdminUsers({
      ...(isFilterEnabled ? filters : { limit: 20, offset: 0 }),
    }));
  }, [dispatch, filters, isFilterEnabled]);

  useEffect(() => { refreshUsers() }, [refreshUsers]);

  const openNew = useCallback(() => { setSelectedUser(null); setFormMode('add'); setShowForm(true); }, []);
  const openEdit = useCallback((user: AdminUser) => { setSelectedUser(user); setFormMode('edit'); setShowForm(true); }, []);
  const handleCloseForm = useCallback(() => {
    setShowForm(false);
    setSelectedUser(null);
    refreshUsers();
  }, [refreshUsers]);

  const columns = useMemo(() => [
    { id: 'id', label: 'ID' },
    { id: 'email', label: 'Email' },
    { id: 'firstName', label: 'First Name' },
    { id: 'lastName', label: 'Last Name' },
    { id: 'role', label: 'Role' },
    { id: 'permissions', label: 'Permissions' },
    { id: 'lastLoginAt', label: 'Last Login' },
    { id: 'createdAt', label: 'Created At' },
    { id: 'updatedAt', label: 'Updated At' },
  ], []);

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
  const rows = useMemo(() => (users ?? []).map(user => {
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
  }), [users]);

  const mapUserToForm = useCallback((user?: AdminUser) => {
    const perms = user?.permissions ?? [];
    return {
      id: user?.id,
      email: user?.baseUser?.email ?? '',
      firstName: user?.baseUser?.firstName ?? '',
      lastName: user?.baseUser?.lastName ?? '',
      passwordHash: '',
      role: user?.role ?? 'hr',
      perm_reportes: perms.includes('reportes'),
      perm_admin: perms.includes('admin'),
      perm_vehicle: perms.includes('vehicle'),
      lastLoginAt: user?.lastLoginAt ?? null,
    };
  }, []);

  const buildPayloadForAPI = useCallback((data: any) => {
    const { perm_reportes, perm_admin, perm_vehicle, passwordHash, ...rest } = data || {};
    const permissions: string[] = [];
    if (perm_reportes) permissions.push('reportes');
    if (perm_admin) permissions.push('admin');
    if (perm_vehicle) permissions.push('vehicle');

    const payload: any = {
      ...rest,
      role: rest.role ?? 'hr',
      permissions,
    };
    if (passwordHash && String(passwordHash).trim() !== '') payload.passwordHash = passwordHash;
    return payload;
  }, []);

  const handleSubmit = useCallback(async (data: any) => {
    const base = buildPayloadForAPI(data);
    const payload = formMode === 'edit' ? { ...base, id: selectedUser?.id } : base;

    try {
      if (formMode === 'add') {
        await dispatch(addAdminUser(payload)).unwrap();
      } else {
        await dispatch(updateAdminUser(payload)).unwrap();
      }
      handleCloseForm();
    } catch (err) {
      console.error('submit error', err);
    }
  }, [dispatch, formMode, selectedUser?.id, buildPayloadForAPI, handleCloseForm]);
  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <AdminUsersPageHeader
        isFilterEnabled={isFilterEnabled}
        setIsFilterEnabled={setIsFilterEnabled}
        filters={filters}
        setFilters={setFilters}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button variant="contained" onClick={openNew}>Add Admin User</Button>
      </Box>

      {!loading && !error && (
        users.length > 0
          ? <>
            <DataTable
              data={{ columns, rows }}
              onRowClick={(row: any) => {
                const u = users.find((x: AdminUser) => x.id === row.id);
                if (u) openEdit(u);
              }}
               title="Admin Users"
              fields={fields}
              onSubmit={handleSubmit}
            />

            <Dialog open={showForm} onClose={() => { setShowForm(false); setSelectedUser(null); }} fullWidth maxWidth="sm">
              <DialogContent>
                <GenericForm
                  key={formMode === 'add' ? 'new' : `edit-${selectedUser?.id ?? 'unknown'}`}
                  title={formMode === 'add' ? 'Add Admin User' : 'Edit Admin User'}
                  fields={fields}
                  initialState={formMode === 'add' ? initialState : (selectedUser ? mapUserToForm(selectedUser) : initialState)}
                  entityToEdit={formMode === 'edit' && selectedUser ? mapUserToForm(selectedUser) : null}
                  onSubmit={handleSubmit}
                  onClose={() => { setShowForm(false); setSelectedUser(null); }}
                />
              </DialogContent>
            </Dialog>
          </>
          : <Typography>No users found</Typography>
      )}

    </Box>
  );
};

export default AdminUsersPage;