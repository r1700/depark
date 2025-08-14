// src/components/AdminUsersFiltersWrapper.tsx
import React, { useState, useEffect } from 'react';
import { Button, Drawer, Box } from '@mui/material';
import FilterPanel from '../../../components/filter-panel/FilterPanel';
import { AdminUserFilters, FieldConfig, AVAILABLE_PERMISSIONS, AVAILABLE_ROLES } from './adminUserTypes';

interface Props {
  filters: AdminUserFilters;
  setFilters: (filters: AdminUserFilters) => void;
  enabled: boolean;
  setEnabled: (value: boolean) => void;
}

const AdminUsersFiltersWrapper: React.FC<Props> = ({ filters, setFilters, enabled, setEnabled }) => {
  const [open, setOpen] = useState(false);

  const [localFilters, setLocalFilters] = useState<AdminUserFilters>({ ...filters });

  useEffect(() => {
    if (open) {
      setLocalFilters(filters);
    }
  }, [open, filters]);

  const [isFilterActive, setIsFilterActive] = useState(false);
  useEffect(() => {
    const active = Object.entries(filters).some(([key, val]) => {
      if (val === undefined || val === null) return false;
      if (typeof val === 'string') return val.trim() !== '';
      if (Array.isArray(val)) return val.length > 0;
      if (typeof val === 'number') return !isNaN(val);
      return true;
    });
    setIsFilterActive(active);
  }, [filters]);

  // איפוס פילטרים בממשק וב-State האב
  const clearFilters = () => {
    const cleared: AdminUserFilters = { limit: 20, offset: 0 };
    setLocalFilters(cleared);
    setFilters(cleared);
    setEnabled(false);
    setOpen(false);
  };

  // לחיצה על Apply מעדכנת את פילטרים ב-Parent ומפעילה את הפילטרים בפועל
  const applyFilters = () => {
    setFilters(localFilters);
    setEnabled(true);
    setOpen(false);
  };

  // הגדרת ה־fields לצורך שימוש ב־FilterPanel הגנרי (הקונפיג של ה־AdminUsers)
  const fieldsConfig: FieldConfig[] = [
    { name: 'searchTerm', type: 'free', label: 'Search by Last Name or Email', placeholder: 'Last name or email' },
    // roles: UI הוא select יחיד אבל הערך ב-state הוא מערך עם פריט יחיד -> valueAsArray: true
    { name: 'roles', type: 'select', label: 'Role', options: [...AVAILABLE_ROLES], valueAsArray: true },
    { name: 'permissionsInclude', type: 'multiSelect', label: 'Permissions Include', options: [...AVAILABLE_PERMISSIONS] },
    { name: 'created', type: 'dateRange', label: 'Created Between', fromKey: 'createdAfter', toKey: 'createdBefore' },
    { name: 'activeLastNDays', type: 'number', label: 'Active Last N Days' },
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
          <FilterPanel
            fields={fieldsConfig}
            filters={localFilters}
            onChange={setLocalFilters}
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