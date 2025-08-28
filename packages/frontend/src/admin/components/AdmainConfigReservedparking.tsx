import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Stack,
  ThemeProvider,
  createTheme
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Info as InfoIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '../app/store';
import { fetchUsers } from '../app/pages/user/userThunks';




const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  border: '2px solid #1976d2',
  borderRadius: '16px',
  boxShadow: '0 4px 20px rgba(25, 118, 210, 0.1)',
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
  position: 'relative',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: '#1565c0',
    boxShadow: '0 16px 50px rgba(25, 118, 210, 0.25)'
  }
}));

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' }
  }
});

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export interface ReservedParkingRow {
  id: number;
  baseuser_id: number;
  parking_number: number;
  day_of_week: string;
  createdat: string;
  updatedat: string;
}

export default function ReservedParkingConfigPage() {
  const location = useLocation();
  const dispatch = useAppDispatch();
  const users = useAppSelector((state) => state.users.users);
  console.log("Users:", users);
  
  // Detect if editing an existing record
  const [editId, setEditId] = useState<number | null>(null);

  // State for reserved parking list and form
  const [reservedParking, setReservedParking] = useState<ReservedParkingRow[]>([]);
  const [newParking, setNewParking] = useState<{ email: string; parking_number: number; day_of_week: string }>({
    email: '',
    parking_number: 0,
    day_of_week: days[0]
  });
  const [showAdd, setShowAdd] = useState(false);

  // Load users once on mount
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  // Initialize form when entering the screen (location.state)
  useEffect(() => {
    if (location.state) {
      const { id, parking_number, day_of_week, email } = location.state as any;
      setEditId(id ?? null);
      setNewParking(prev => ({
        ...prev,
        parking_number: parking_number ?? 0,
        day_of_week: day_of_week ?? days[0],
        email: email ?? prev.email
      }));
    } else {
      setEditId(null);
      setNewParking({ email: '', parking_number: 0, day_of_week: days[0] });
    }
  }, [location.state]);

  // If we're editing and the form email is empty, try to fill it from users (using baseuser_id from location)
  useEffect(() => {
    if (!editId) return;
    if (newParking.email) return;
    const baseuser_id = (location.state as any)?.baseuser_id;
    if (!baseuser_id) return;
    if (Array.isArray(users) && users.length) {
      const userObj = users.find((u: any) => u.baseuser_id === baseuser_id);
      if (userObj?.email) {
        setNewParking(prev => ({ ...prev, email: userObj.email }));
      }
    }
  }, [users, editId, newParking.email, location.state]);

  useEffect(() => {
    // Fetch reserved parking data from server
    const fetchData = async () => {
      const response = await fetch('/api/reservedparking');
      const data = await response.json();
      setReservedParking(data);
    };
    fetchData();
  }, []);

  // Add or update function
  const handleSaveParking = async () => {
    const baseuser_id = (users.find((u) => u.email === newParking.email) as any)?.baseuser_id;
    console.log('Found baseuser_id:', baseuser_id);

    if (!baseuser_id) {
      setMessage({ type: 'error', text: '❌ Email does not exist in the system!' });
      return;
    }
    // Check for duplicates only when adding
    if (!editId) {
      const duplicate = reservedParking.some((row: ReservedParkingRow) =>
        row.parking_number === newParking.parking_number &&
        row.day_of_week === newParking.day_of_week
      );
      if (duplicate) {
        setMessage({ type: 'error', text: '❌ Reserved parking already exists for this day!' });
        return;
      }
    }
    setSaving(true);
    try {
      let response;
      if (editId) {
        // Update existing record
        const payload = {
          id: editId,
          baseuser_id,
          parking_number: newParking.parking_number,
          day_of_week: newParking.day_of_week
        };
        console.log('Updating backend:', payload);
        response = await fetch('/api/reservedparking/update', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Add new record
        const payload = {
          baseuser_id,
          parking_number: newParking.parking_number,
          day_of_week: newParking.day_of_week
        };
        console.log('Sending to backend:', payload);
        response = await fetch('/api/reservedparking/add', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }
      if (!response!.ok) {
        const errorText = await response!.text();
        console.error('Failed to save reserved parking:', errorText);
        throw new Error('Failed to save reserved parking: ' + errorText);
      }
      setMessage({ type: 'success', text: editId ? '✅ Reserved parking updated successfully!' : '✅ Reserved parking saved successfully!' });
      // Refresh the list from the server
      const refreshed = await fetch('/api/reservedparking');
      setReservedParking(await refreshed.json());
      setEditId(null);
    } catch (err) {
      setMessage({ type: 'error', text: '❌ Failed to save reserved parking!' });
    }
    setSaving(false);
    setShowAdd(false);
    setNewParking({ email: '', parking_number: 0, day_of_week: days[0] });
  };

  // const handleDeleteParking = (id: number) => {
  //   // Delete reserved parking (implement API call)
  //   setReservedParking(prev => prev.filter(row => row.id !== id));
  // };

  // Save/Reset button states
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);

  // Dummy hasChanges logic (replace with real logic if needed)
  const hasChanges = () => true;

  // Dummy reset handler
  const handleResetClick = () => {
    setShowResetConfirm(true);
  };
  const confirmReset = () => {
    setShowResetConfirm(false);
    setReservedParking([]);
    setNewParking({ email: '', parking_number: 0, day_of_week: days[0] });
    setMessage({ type: 'success', text: '🔄 Reset to defaults!' });
  };
  const cancelReset = () => setShowResetConfirm(false);

  // Auto-hide message
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 2500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Box textAlign="center" mb={4}>
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => window.location.href = '/reserved-parking'}
                sx={{
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                }}
              >
                ← Back to Reserved Parking List
              </Button>
            </Box>
            <Typography variant="h3" component="h1" gutterBottom sx={{
              fontWeight: 400,
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 2,
              mb: 4
            }}>
              Reserved Parking Management
            </Typography>
          </Box>
          <Box sx={{ width: '100%', mb: 4 }}>
            <StyledCard>
              <CardHeader
                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><InfoIcon /></Avatar>}
                title={<Typography variant="h6">{editId ? 'Edit Reserved Parking' : 'Add Reserved Parking'}</Typography>}
              />
              <CardContent>
                <Stack spacing={2}>
                  <TextField
                    label="Email"
                    type="email"
                    value={newParking.email || ''}
                    onChange={e => {
                      setNewParking(prev => ({ ...prev, email: e.target.value }));
                    }}
                    fullWidth
                  />
                  <TextField
                    label="Parking Number"
                    type="number"
                    value={newParking.parking_number || ''}
                    onChange={e => setNewParking(prev => ({ ...prev, parking_number: Number(e.target.value) }))}
                    fullWidth
                  />
                  <FormControl fullWidth>
                    <InputLabel>Day of Week</InputLabel>
                    <Select
                      value={newParking.day_of_week || days[0]}
                      label="Day of Week"
                      onChange={e => setNewParking(prev => ({ ...prev, day_of_week: e.target.value as string }))}
                    >
                      {days.map(day => <MenuItem key={day} value={day}>{day}</MenuItem>)}
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </StyledCard>
          </Box>
          {/* Action buttons */}
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={handleSaveParking}
                disabled={saving || !!message || showErrorPopup || !hasChanges() || !newParking.email || !newParking.parking_number}
                sx={{
                  minWidth: 200,
                  bgcolor: hasChanges() && newParking.email && newParking.parking_number ? 'primary.main' : 'grey.400',
                  color: 'white',
                  boxShadow: hasChanges() && newParking.email && newParking.parking_number ? '0 4px 16px rgba(25, 118, 210, 0.10)' : 'none',
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    bgcolor: hasChanges() && newParking.email && newParking.parking_number ? 'primary.dark' : 'grey.500',
                    boxShadow: hasChanges() && newParking.email && newParking.parking_number ? '0 8px 32px rgba(25, 118, 210, 0.18)' : 'none',
                    transform: hasChanges() && newParking.email && newParking.parking_number ? 'translateY(-2px) scale(1.03)' : 'none'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.400',
                    color: 'white',
                    boxShadow: 'none',
                    opacity: 0.7
                  }
                }}
              >
                {saving
                  ? 'Saving Settings...'
                  : hasChanges() && newParking.email && newParking.parking_number
                    ? (editId ? '💾 Update Reserved Parking' : '💾 Save Reserved Parking')
                    : '✅ No Changes to Save'
                }
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleResetClick}
                disabled={saving || !hasChanges() || !newParking.email || !newParking.parking_number}
                sx={{
                  minWidth: 150,
                  color: hasChanges() && newParking.email && newParking.parking_number ? 'primary.main' : 'grey.400',
                  borderColor: hasChanges() && newParking.email && newParking.parking_number ? 'primary.main' : 'grey.300',
                  fontWeight: 700,
                  letterSpacing: 1,
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: hasChanges() && newParking.email && newParking.parking_number ? '0 2px 8px rgba(25, 118, 210, 0.07)' : 'none',
                  '&:hover': {
                    bgcolor: hasChanges() && newParking.email && newParking.parking_number ? 'primary.main' : 'grey.100',
                    color: hasChanges() && newParking.email && newParking.parking_number ? 'white' : 'grey.400',
                    borderColor: hasChanges() && newParking.email && newParking.parking_number ? 'primary.dark' : 'grey.300',
                    boxShadow: hasChanges() && newParking.email && newParking.parking_number ? '0 8px 32px rgba(25, 118, 210, 0.18)' : 'none',
                    transform: hasChanges() && newParking.email && newParking.parking_number ? 'translateY(-2px) scale(1.03)' : 'none'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.100',
                    color: 'grey.400',
                    borderColor: 'grey.300',
                    boxShadow: 'none',
                    opacity: 0.7
                  }
                }}
              >
                🔄 Reset
              </Button>
            </Stack>
          </Box>
          {/* Reset confirmation dialog */}
          {showResetConfirm && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                bgcolor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1500
              }}
            >
              <Box
                sx={{
                  bgcolor: 'white',
                  borderRadius: 2,
                  p: 3,
                  maxWidth: 400,
                  width: '90%',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
                }}
              >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#1976d2' }}>
                  ⚠️ Reset Confirmation
                </Typography>
                <Typography variant="body1" sx={{ mb: 3 }}>
                  Are you sure you want to reset all reserved parking?
                </Typography>
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button variant="outlined" onClick={cancelReset} sx={{ minWidth: 100 }}>
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    color="error"
                    onClick={confirmReset}
                    sx={{
                      minWidth: 100,
                      bgcolor: '#d32f2f',
                      '&:hover': { bgcolor: '#b71c1c' }
                    }}
                  >
                    Reset
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
          {/* Success message */}
          {message && message.type === 'success' && (
            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: 'primary.main',
                color: 'white',
                px: 4,
                py: 2,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,118,210,0.3)',
                zIndex: 2000,
                minWidth: 300,
                textAlign: 'center',
                fontSize: '1.2rem',
                fontWeight: 600,
                animation: 'fadeIn 0.3s'
              }}
            >
              {message.text}
            </Box>
          )}

          {/* Error message (email does not exist or duplicate user) */}
          {message && message.type === 'error' && (
            <Box
              sx={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                bgcolor: '#fff',
                color: '#d32f2f',
                px: 4,
                py: 3,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(211,47,47,0.2)',
                zIndex: 2100,
                minWidth: 320,
                textAlign: 'center',
                fontSize: '1.1rem',
                fontWeight: 600,
                border: '2px solid #d32f2f',
                animation: 'fadeIn 0.3s'
              }}
            >
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#d32f2f' }}>
                  ⚠️ Error
                </Typography>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  {message.text}
                </Typography>
            </Box>
          )}
        </Paper>
      </Container>
    </ThemeProvider>
  );
}