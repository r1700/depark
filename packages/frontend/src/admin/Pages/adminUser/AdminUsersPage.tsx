import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/store';
import { fetchAdminUsers, addAdminUser, updateAdminUser } from '../../app/pages/adminUser/adminUserSlice';
import DataTable from '../../components/table/table';
import GenericForm, { FieldConfig } from '../../components/forms/Form';
import { AdminUser, AdminUserFilters } from './adminUserTypes';
import { Box, CircularProgress, Typography, Button, Dialog, DialogContent } from '@mui/material';
import AdminUsersPageHeader from './AdminUsersPageHeader';
import { Alert } from '@mui/material';

const AdminUsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const [formError, setFormError] = useState<string | null>(null);
  const users = useAppSelector(state => state.adminUsers.users ?? []);
  const loading = useAppSelector(state => state.adminUsers.loading);
  const error = useAppSelector(state => state.adminUsers.error);
  const [filters, setFilters] = useState<AdminUserFilters>({ limit: 20, offset: 0 });
  const [isFilterEnabled, setIsFilterEnabled] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  // ADD state
  const [showAddForm, setShowAddForm] = useState(false);

  // EDIT state (managed by DataTable)
  const [showEditForm, setShowEditForm] = useState(false);
  const [editUser, setEditUser] = useState<any>(null);

  const refreshUsers = useCallback(() => {
    dispatch(fetchAdminUsers({
      ...(isFilterEnabled ? filters : { limit: 20, offset: 0 }),
    }));
  }, [dispatch, filters, isFilterEnabled]);

  useEffect(() => { refreshUsers() }, [refreshUsers]);

  // ADD: open form
  const openAddForm = useCallback(() => {
    setShowAddForm(true);
  }, []);

  // EDIT: open form from table
  const handleEditClick = useCallback((row: any) => {
      console.log('handleEditClick row:', row);

    setEditUser(row);
    setShowEditForm(true);
  }, []);

  const handleCloseAddForm = useCallback(() => {
    setShowAddForm(false);
    refreshUsers();
  }, [refreshUsers]);

  const handleCloseEditForm = useCallback(() => {
    setShowEditForm(false);
    setEditUser(null);
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

  // ADD user
  const handleAddSubmit = useCallback(async (data: any) => {
    setFormError(null);
    try {
      await dispatch(addAdminUser(buildPayloadForAPI(data))).unwrap();
      handleCloseAddForm();
    } catch (err: any) {
      console.error('ERROR CAUGHT:', err);
      let msg = 'Unknown error';
      // Try to extract a readable error message
      if (typeof err?.error === 'string') {
        msg = err.error;
      } else if (typeof err?.data?.error === 'string') {
        msg = err.data.error;
      } else if (typeof err?.message === 'string') {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      } else if (typeof err?.data?.message === 'string') {
        msg = err.data.message;
      } else if (typeof err?.error?.message === 'string') {
        msg = err.error.message;
      } else if (err?.status === 400) {
        msg = 'Validation error. Please check your input.';
      } else if (err?.error && typeof err.error === 'object') {
        // Try to extract a string from nested error object
        msg = err.error.error || err.error.message || JSON.stringify(err.error, null, 2);
      } else if (err && typeof err === 'object') {
        // Try to find any string property in the error object
        const strVal = Object.values(err).find(v => typeof v === 'string');
        if (strVal) msg = strVal as string;
        else msg = JSON.stringify(err, null, 2);
      } else {
        msg = JSON.stringify(err, null, 2);
      }
      setFormError(msg);
    }
  }, [dispatch, buildPayloadForAPI, handleCloseAddForm]);

  // EDIT user
  const handleEditSubmit = useCallback(async (data: any) => {
    setFormError(null);
    try {
      await dispatch(updateAdminUser({ ...buildPayloadForAPI(data), id: editUser?.id })).unwrap();
      refreshUsers();
      handleCloseEditForm();
    } catch (err: any) {
      console.error('EDIT ERROR CAUGHT:', err);
      let msg = 'Unknown error';
      // Try to extract a readable error message
      if (typeof err?.error === 'string') {
        msg = err.error;
      } else if (typeof err?.data?.error === 'string') {
        msg = err.data.error;
      } else if (typeof err?.message === 'string') {
        msg = err.message;
      } else if (typeof err === 'string') {
        msg = err;
      } else if (typeof err?.data?.message === 'string') {
        msg = err.data.message;
      } else if (typeof err?.error?.message === 'string') {
        msg = err.error.message;
      } else if (err?.status === 400) {
        msg = 'Validation error. Please check your input.';
      } else if (err?.error && typeof err.error === 'object') {
        // Try to extract a string from nested error object
        msg = err.error.error || err.error.message || JSON.stringify(err.error, null, 2);
      } else if (err && typeof err === 'object') {
        // Try to find any string property in the error object
        const strVal = Object.values(err).find(v => typeof v === 'string');
        if (strVal) msg = strVal as string;
        else msg = JSON.stringify(err, null, 2);
      } else {
        msg = JSON.stringify(err, null, 2);
      }
      setFormError(msg);
    }
  }, [dispatch, editUser?.id, buildPayloadForAPI, refreshUsers, handleCloseEditForm]);

  if (loading) return <CircularProgress />;

  return (
    <Box sx={{ p: 2 }}>
      <AdminUsersPageHeader
        isFilterEnabled={isFilterEnabled}
        setIsFilterEnabled={setIsFilterEnabled}
        filters={filters}
        setFilters={setFilters}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 1 }}>
        <Button variant="contained" onClick={openAddForm}>Add Admin User</Button>
      </Box>

      {error && (
        <Box sx={{ mb: 2 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      )}

      {!loading && (
        users.length > 0
          ? <>
            <DataTable
              data={{ columns, rows }}
              onEdit={handleEditClick}
              title="Admin Users"
              fields={fields}
              showDelete={false}
              stickyColumns={['id']}
              onSubmit={(data) => { console.log('DataTable onSubmit', data); handleEditSubmit(data); }}
            />

            {/* EDIT FORM - managed by DataTable */}
            {showEditForm && (
              <Dialog open={showEditForm} onClose={handleCloseEditForm} fullWidth maxWidth="sm">
                <DialogContent>
                  {formError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {formError}
                    </Alert>
                  )}
                  {editUser && (
                    <GenericForm
                      key={`edit-${editUser.id ?? 'unknown'}`}
                      title="Edit Admin User"
                      fields={fields}
                      initialState={editUser}
                      entityToEdit={editUser}
                      onSubmit={handleEditSubmit}
                      onClose={handleCloseEditForm}
                    />
                  )}
                </DialogContent>
              </Dialog>
            )}

            {/* ADD FORM - managed by page */}
            {showAddForm && (
              <Dialog open={showAddForm} onClose={handleCloseAddForm} fullWidth maxWidth="sm">
                <DialogContent>
                  {formError && (
                    <Box sx={{ mb: 2 }}>
                      <Typography color="error">{formError}</Typography>
                    </Box>
                  )}
                  <GenericForm
                    key="new"
                    title="Add Admin User"
                    fields={fields}
                    initialState={initialState}
                    entityToEdit={null}
                    onSubmit={handleAddSubmit}
                    onClose={handleCloseAddForm}
                  />
                </DialogContent>
              </Dialog>
            )}
          </>
          : <Typography>No users found</Typography>
      )}

    </Box>
  );
};

export default AdminUsersPage;