import React, { useEffect, useState } from 'react';
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

/**
 * סוג מקומי שמאפשר להשתמש ב-FieldConfig המוגדר במקום,
 * אבל מחזק ש-fromKey/toKey ו-name יהיו מפתחות מתוך AdminUserFilters.
 */
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

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const [isFilterActive, setIsFilterActive] = useState(false);
  useEffect(() => {
    const active = Object.entries(filters).some(([_, val]) => {
      if (val === undefined || val === null) return false;
      if (typeof val === 'string') return val.trim() !== '';
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'number') return !isNaN(val);
      return true;
    });
    setIsFilterActive(active);
  }, [filters]);

  const clearFilters = () => {
    const cleared: AdminUserFilters = { limit: 20, offset: 0 };
    setLocalFilters(cleared);
    setFilters(cleared);
    setEnabled(false);
    setOpen(false);
  };

  const applyFilters = () => {
    setFilters(localFilters);
    setEnabled(true);
    setOpen(false);
  };

  // שימו לב: 'createdAfter' / 'createdBefore' הם מפתחות שקיימים ב-AdminUserFilters.
  // לכן אנחנו משתמשים ב-'createdAfter' כשם השדה הראשי (לקבוצה dateRange).
  const fieldsConfig: FieldConfigForAdmin[] = [
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
      // changed from 'created' to an actual AdminUserFilters key 'createdAfter'
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
  ];

  return (
    <>
      <Button
        variant={enabled ? 'contained' : 'outlined'}
        color={enabled ? 'primary' : undefined}
        onClick={() => setOpen(true)}
      >
        Filters
      </Button>

      <Drawer anchor="right" open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 320, p: 2 }}>
          <FilterPanel<AdminUserFilters>
            fields={fieldsConfig as any}
            filters={localFilters}
            onChange={(partial) =>
              setLocalFilters((prev) => ({ ...(prev as AdminUserFilters), ...(partial as Partial<AdminUserFilters>) }))
            }
            onClear={clearFilters}
          />

          <Button variant="contained" fullWidth onClick={applyFilters} sx={{ mt: 2 }}>
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminUsersFiltersWrapper;