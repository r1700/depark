import React from 'react';
import DataTable from '../table/table';
import { Box, Typography, IconButton, Snackbar, Alert } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate, useLocation } from 'react-router-dom';
const API_BASE = process.env.REACT_APP_CORS_ORIGIN || ''; // Adjust as needed or use environment variables
console.log('API_BASE:', API_BASE);

const UnknownVehicles: React.FC = () => {
  const [data, setData] = React.useState<{ columns: any[]; rows: any[] }>({ columns: [], rows: [] });
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [successOpen, setSuccessOpen] = React.useState(false);
  const [successMessage, setSuccessMessage] = React.useState<string>('Operation completed successfully');
  const navigate = useNavigate();
  const location = useLocation();

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/unknown-vehicles`, { credentials: 'include' });
      let json: any = null;
      try { json = await res.json(); } catch { json = null; }
      if (!res.ok) {
        const errMsg = (json && (json.message || json.error)) ? (json.message || json.error) : `Server ${res.status}${res.statusText ? ' ' + res.statusText : ''}`;
        throw new Error(errMsg);
      }

      let rows: any[] = [];
      if (Array.isArray(json)) rows = json;
      else if (json && Array.isArray(json.rows)) rows = json.rows;
      else rows = [];

      // רק העמודות שברצוננו להציג (ללא 'model')
      const desired = ['full_name', 'license_plate'];
      const sample = rows[0] ?? { license_plate: null, full_name: null };
      const columns = desired
        .filter(k => k in sample)
        .map(k => ({ id: k, label: k.replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()) }));

      setData({ columns, rows });
    } catch (e: any) {
      console.error('fetch unknown-vehicles error', e);
      setError(e?.message ?? 'Failed to load vehicles');
      setData({ columns: [], rows: [] });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const successParam = params.get('success');
    const stateSuccess = (location.state as any)?.success;
    if (stateSuccess === true || successParam === '1') {
      setSuccessMessage((location.state as any)?.message ?? 'Model added successfully');
      setSuccessOpen(true);
      try {
        const newUrl = window.location.pathname + window.location.hash;
        window.history.replaceState({}, document.title, newUrl);
      } catch (e) {}
      try { navigate('.', { replace: true, state: {} }); } catch (e) {}
    }
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefresh = () => fetchData();

  const handleSuccessClose = (_e?: any, reason?: string) => {
    if (reason === 'clickaway') return;
    setSuccessOpen(false);
  };

  const handleEdit = (row: any) => {
    if (!row) return;
    const id = row.id ?? row.vehicle_id;
    if (id) {
      // חשוב: נתיב מוחלט בתוך ה־admin routing
      navigate(`/admin/layout/resolve/${id}`, { state: { license_plate: row.license_plate } });
    } else if (row.license_plate) {
      navigate(`/admin/layout/resolve`, { state: { license_plate: row.license_plate } });
    } else {
      console.warn('No id or license_plate for row', row);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <Box sx={{ p: 2 }}>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
        <Typography variant="h5">Unknown Vehicles</Typography>
        <IconButton onClick={handleRefresh} aria-label="refresh"><RefreshIcon/></IconButton>
      </Box>

      {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}

      <DataTable
        data={data}
        stickyColumns={['full_name', 'license_plate']}
        showEdit={true}
        showDelete={false}
        onEdit={handleEdit}
      />

      <Snackbar open={successOpen} autoHideDuration={4000} onClose={handleSuccessClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSuccessClose} severity="success" sx={{ width: '100%' }}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default UnknownVehicles;