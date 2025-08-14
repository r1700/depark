import React, { useState, useEffect } from 'react';
import { Drawer, Box, Button } from '@mui/material';
import SortPanel from './SortPanel';

interface AdminUsersSortWrapperProps {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  setSortBy: (value: string | undefined) => void;
  setSortDirection: (value: 'asc' | 'desc' | undefined) => void;
  enabled: boolean;
  setEnabled: (enabled: boolean) => void;
}

const AdminUsersSortWrapper: React.FC<AdminUsersSortWrapperProps> = ({
  sortBy,
  sortDirection,
  setSortBy,
  setSortDirection,
  enabled,
  setEnabled,
}) => {
  // מצב מקומי לעריכת המיון בדיאלוג
  const [localSortBy, setLocalSortBy] = useState<string | undefined>(sortBy);
  const [localSortDirection, setLocalSortDirection] = useState<'asc' | 'desc' | undefined>(sortDirection);

  // כשהפאנל נפתח, נעדכן את הערכים המ-local בהתאם לפרופס
  useEffect(() => {
    if (enabled) {
      setLocalSortBy(sortBy);
      setLocalSortDirection(sortDirection);
    }
  }, [enabled, sortBy, sortDirection]);

  const openDrawer = () => setEnabled(true);
  const closeDrawer = () => setEnabled(false);

  const applyChanges = () => {
    setSortBy(localSortBy);
    setSortDirection(localSortDirection);
    closeDrawer();
  };

  const clearSorting = () => {
    setLocalSortBy(undefined);
    setLocalSortDirection(undefined);
  };

return (
    <>
      <Button variant="outlined" onClick={() => setEnabled(true)}>
        Sort Options
      </Button>

      <Drawer anchor="right" open={enabled} onClose={() => setEnabled(false)}>
        <Box sx={{ width: 280, p: 2 }}>
          <SortPanel
            sortBy={localSortBy}
            sortDirection={localSortDirection}
            onChangeSortBy={setLocalSortBy}
            onChangeSortDirection={setLocalSortDirection}
            onClear={clearSorting}
          />
          <Button variant="contained" fullWidth onClick={applyChanges} sx={{ mt: 2 }}>
            Apply
          </Button>
        </Box>
      </Drawer>
    </>
  );
};

export default AdminUsersSortWrapper;