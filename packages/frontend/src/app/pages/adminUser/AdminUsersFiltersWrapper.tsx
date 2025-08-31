import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { Button, Drawer, Box } from '@mui/material';
import FilterPanel from '../../../components/filter-panel/FilterPanel';
import {
  AdminUserFilters,
  FieldConfig,
  AVAILABLE_PERMISSIONS,
  AVAILABLE_ROLES,
} from './adminUserTypes';

interface Props {
  filters: AdminUserFilters;
  setFilters: (filters: AdminUserFilters) => void;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}
type FieldConfigForAdmin = Omit<FieldConfig, 'name' | 'fromKey' | 'toKey'> & {
  name: Extract<keyof AdminUserFilters, string>;
  fromKey?: Extract<keyof AdminUserFilters, string>;
  toKey?: Extract<keyof AdminUserFilters, string>;
};

const AdminUsersFiltersWrapper: React.FC<Props> = ({
  filters,
  setFilters,
  enabled,
  setEnabled,
}) => {
  const [open, setOpen] = useState(false);
  const [localFilters, setLocalFilters] = useState<AdminUserFilters>({ ...filters });

  // sync when drawer opens (so edits start from current filters)
  useEffect(() => {
    if (open) setLocalFilters(filters);
  }, [open, filters]);

  const openDrawer = useCallback(() => setOpen(true), []);
  const closeDrawer = useCallback(() => setOpen(false), []);

  const clearFilters = useCallback(() => {
    const cleared: AdminUserFilters = { limit: 20, offset: 0 };
    setLocalFilters(cleared);
    setFilters(cleared);
    setEnabled(false);
    setOpen(false);
  }, [setFilters, setEnabled]);

  const applyFilters = useCallback(() => {
    setFilters(localFilters);
    setEnabled(true);
    setOpen(false);
  }, [localFilters, setFilters, setEnabled]);

  const handleLocalChange = useCallback(
    (partial: Partial<AdminUserFilters>) => {
      setLocalFilters(prev => ({ ...(prev as AdminUserFilters), ...(partial as Partial<AdminUserFilters>) }));
    },
    []
  );

  const fieldsConfig = useMemo<FieldConfigForAdmin[]>(() => [
    {
      name: 'searchTerm',
      type: 'free',
      label: 'Search by Last Name or Email',
      placeholder: 'Last name or email',
    },
    {
      name: 'roles',
      type: 'select',
      label: 'Role',
      options: [...AVAILABLE_ROLES],
      valueAsArray: true,
    },
    {
      name: 'permissionsInclude',
      type: 'multiSelect',
      label: 'Permissions Include',
      options: [...AVAILABLE_PERMISSIONS],
    },
    {
      name: 'createdAfter',
      type: 'dateRange',
      label: 'Created Between',
      fromKey: 'createdAfter',
      toKey: 'createdBefore',
    },
    {
      name: 'activeLastNDays',
      type: 'number',
      label: 'Active Last N Days',
    },
  ], []);

  return (
    <>
      <Button
        variant={enabled ? 'contained' : 'outlined'}
        color={enabled ? 'primary' : undefined}
        onClick={openDrawer}
        aria-label="Open filters"
      >
        Filters
      </Button>

      <Drawer anchor="right" open={open} onClose={closeDrawer}>
        <Box sx={{ width: 320, p: 2 }}>
          <FilterPanel<AdminUserFilters>
            fields={fieldsConfig as any}
            filters={localFilters}
            onChange={handleLocalChange}
            onClear={clearFilters}
          />
          <Button
            variant="contained"
            fullWidth
            onClick={applyFilters}
            sx={{ mt: 2 }}
            aria-label="Apply filters"
          >
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminUsersFiltersWrapper;