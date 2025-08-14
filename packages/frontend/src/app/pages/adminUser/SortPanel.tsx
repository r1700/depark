import React from 'react';
import { Box, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material';

interface SortPanelProps {
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  onChangeSortBy: (value: string | undefined) => void;
  onChangeSortDirection: (value: 'asc' | 'desc' | undefined) => void;
  onClear: () => void;
}

const allowedSortBy = ['permissions', 'lastName', 'createdAt', 'lastLoginAt', 'updatedAt', 'lastActivityTimestamp'];

const SortPanel: React.FC<SortPanelProps> = ({
  sortBy,
  sortDirection,
  onChangeSortBy,
  onChangeSortDirection,
  onClear,
}) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: 280, p: 2 }}>
      <FormControl size="small">
        <InputLabel>Sort By</InputLabel>
        <Select
          label="Sort By"
          value={sortBy || ''}
          onChange={e => onChangeSortBy(e.target.value || undefined)}
        >
          <MenuItem value="">None</MenuItem>
          {allowedSortBy.map(field => (
            <MenuItem key={field} value={field}>{field}</MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl size="small">
        <InputLabel>Sort Direction</InputLabel>
        <Select
          label="Sort Direction"
          value={sortDirection || ''}
          onChange={e => onChangeSortDirection(e.target.value as 'asc' | 'desc' || undefined)}
        >
          <MenuItem value="">None</MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
          <MenuItem value="desc">Descending</MenuItem>
        </Select>
      </FormControl>

      {/* כפתור ניקוי */}
      <Button variant="outlined" onClick={onClear}>
        Clear Sorting
      </Button>
    </Box>
  );
};

export default SortPanel;