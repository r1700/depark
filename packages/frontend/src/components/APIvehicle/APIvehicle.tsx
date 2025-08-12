import React, { useState, useEffect } from 'react';
import {
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography
} from '@mui/material';
import DataTable from '../table/table';
import { fetchFilteredVehicles } from './fetch';


const APIvehicle = () => {
  const [search, setSearch] = useState('');
  const [isActive, setIsActive] = useState<string>('');
  const [isCurrentlyParked, setIsCurrentlyParked] = useState<string>('');
  const [createdAt, setCreatedAt] = useState('');
  const [updatedAt, setUpdatedAt] = useState('');


  const [data, setData] = useState<{ columns: any[]; rows: any[] }>({ columns: [], rows: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');


  const loadData = async () => {
    setLoading(true);
    setError('');


    try {
      const filters = {
        search: search.trim() || undefined,
        is_active: isActive === '' ? undefined : isActive === 'true',
        is_currently_parked: isCurrentlyParked === '' ? undefined : isCurrentlyParked === 'true',
        created_at: createdAt || undefined,
        updated_at: updatedAt || undefined,
      };


      const data = await fetchFilteredVehicles(filters);
      setData(data);
    } catch (e: any) {
      setError(e.message || 'Error loading vehicles');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadData();
  }, []);


  return (
    <Box sx={{ maxWidth: 1000, mx: 'auto', p: 3 }}>
      <Typography variant="h4" mb={3}>
        Vehicles – Combined Filter
      </Typography>


      <Box component="form" sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
        <TextField
          label="Name, License Plate, Phone, or Email"
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ minWidth: 300 }}
        />


        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Active</InputLabel>
          <Select
            value={isActive}
            label="Active"
            onChange={(e) => setIsActive(e.target.value)}
          >
            <MenuItem value="">
              <em>Choose</em>
            </MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>


        <FormControl variant="outlined" size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Currently Parked</InputLabel>
          <Select
            value={isCurrentlyParked}
            label="Currently Parked"
            onChange={(e) => setIsCurrentlyParked(e.target.value)}
          >
            <MenuItem value="">
              <em>Choose</em>
            </MenuItem>
            <MenuItem value="true">Yes</MenuItem>
            <MenuItem value="false">No</MenuItem>
          </Select>
        </FormControl>


        <TextField
          label="Created At"
          type="date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={createdAt}
          onChange={(e) => setCreatedAt(e.target.value)}
          sx={{ minWidth: 180 }}
        />


        <TextField
          label="Updated At"
          type="date"
          InputLabelProps={{ shrink: true }}
          size="small"
          value={updatedAt}
          onChange={(e) => setUpdatedAt(e.target.value)}
          sx={{ minWidth: 180 }}
        />
      </Box>


      <Button variant="contained" onClick={loadData} disabled={loading} sx={{ mb: 3 }}>
        {loading ? 'Loading...' : 'Load Vehicles'}
      </Button>


      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}


      <DataTable data={data} />
    </Box>
  );
};


export default APIvehicle;