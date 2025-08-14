import React from 'react';
import { Box, Typography, Switch, FormControlLabel } from '@mui/material';
import AdminUsersFiltersWrapper from './AdminUsersFiltersWrapper';
import AdminUsersSortWrapper from './AdminUsersSortWrapper';
import { AdminUserFilters } from './adminUserTypes';

interface AdminUsersPageHeaderProps {
  isSortEnabled: boolean;
  setIsSortEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isFilterEnabled: boolean;
  setIsFilterEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  isSortPanelOpen: boolean;
  setIsSortPanelOpen: React.Dispatch<React.SetStateAction<boolean>>;
  filters: AdminUserFilters;
  setFilters: (filters: AdminUserFilters) => void;
  sortBy?: string;
  setSortBy: (value?: string) => void;
  sortDirection?: 'asc' | 'desc';
  setSortDirection: (value?: 'asc' | 'desc') => void;
}

const AdminUsersPageHeader: React.FC<AdminUsersPageHeaderProps> = ({
  isSortEnabled,
  setIsSortEnabled,
  isFilterEnabled,
  setIsFilterEnabled,
  isSortPanelOpen,
  setIsSortPanelOpen,
  filters,
  setFilters,
  sortBy,
  setSortBy,
  sortDirection,
  setSortDirection,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
        px: 2,
      }}
    >
      {/* צד שמאל - סינון */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
        <AdminUsersFiltersWrapper
          filters={filters}
          setFilters={setFilters}
          enabled={isFilterEnabled}
          setEnabled={setIsFilterEnabled}
        />
        <FormControlLabel
          sx={{ mt: 1 }}
          label={isFilterEnabled ? 'Filter: ON' : 'Filter: OFF'}
          control={
            <Switch
              checked={isFilterEnabled}
              onChange={() => setIsFilterEnabled(prev => !prev)}
              color="primary"
            />
          }
        />
      </Box>

      {/* כותרת מרכזית */}
      <Typography
        variant="h4"
        sx={{
          color: '#1e3687',
          fontWeight: 'bold',
          textAlign: 'center',
          flexGrow: 1,
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        Admin Users Management
      </Typography>

      {/* צד ימין - מיון */}
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <AdminUsersSortWrapper
          sortBy={sortBy}
          sortDirection={sortDirection}
          setSortBy={setSortBy}
          setSortDirection={setSortDirection}
          enabled={isSortPanelOpen}
          setEnabled={setIsSortPanelOpen}
        />
        <FormControlLabel
          sx={{ mt: 1 }}
          label={isSortEnabled ? 'Sort: ON' : 'Sort: OFF'}
          control={
            <Switch
              checked={isSortEnabled}
              onChange={() => setIsSortEnabled(prev => !prev)}
              color="primary"
            />
          }
        />
      </Box>
    </Box>
  );
};

export default AdminUsersPageHeader;