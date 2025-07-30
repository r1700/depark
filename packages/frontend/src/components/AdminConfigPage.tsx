import React, { useState, useEffect } from 'react';
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
  Chip,
  FormControlLabel,
  Card,
  CardContent,
  CardHeader,
  Avatar,
  Stack,
  Divider,
  ThemeProvider,
  createTheme,
  Checkbox,
  Radio,
  RadioGroup
} from '@mui/material';

import {
  Info as InfoIcon,
  LocalParking as ParkingIcon,
  Schedule as ScheduleIcon,
  Queue as QueueIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  AccessTime as TimeIcon
} from '@mui/icons-material';

import { styled } from '@mui/material/styles';

// Types
interface ParkingConfig {
  facilityName: string;
  lotId: string;
  timezone: string;
  surfaceSpotIds: string[];
  totalSurfaceSpots: number;
  dailyHours: {
    [key: string]: {
      isActive: boolean;
      openingHour: string;
      closingHour: string;
    };
  };
  maxQueueSize: number;
  avgRetrievalTime: number;
  maxParallelRetrievals: number; 
  maintenanceMode: boolean;
  showAdminAnalytics: boolean;
  updatedAt?: Date;
  updatedBy?: string;
}

// Styled Components
// Alternative - blue glow border:
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  border: '2px solid #1976d2',
  borderRadius: '16px',
  boxShadow: `
    0 4px 20px rgba(25, 118, 210, 0.1),
    0 0 0 1px rgba(25, 118, 210, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1)
  `, // Multiple shadows for depth effect
  background: 'linear-gradient(145deg, #ffffff 0%, #f8fbff 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: -2,
    left: -2,
    right: -2,
    bottom: -2,
    background: 'linear-gradient(135deg, #1976d2, #42a5f5, #1976d2)',
    borderRadius: '18px',
    opacity: 0,
    transition: 'opacity 0.3s ease',
    zIndex: -1,
  },
  '&:hover': {
    transform: 'translateY(-6px)',
    borderColor: '#1565c0',
    boxShadow: `
      0 16px 50px rgba(25, 118, 210, 0.25),
      0 0 0 1px rgba(25, 118, 210, 0.1),
      0 0 30px rgba(25, 118, 210, 0.3)
    `, // Blue glow
    '&::before': {
      opacity: 0.1, // Soft glow around
    }
  },
}));

const StyledChip = styled(Chip)(({ theme }) => ({
  transition: 'background-color 0.2s ease', // Only transition for color
}));

// Theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Constants
const timezones = [
  'Asia/Jerusalem',
  'America/New_York',
  'Europe/London',
  'Asia/Tokyo',
  'Australia/Sydney'
];

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const maxSpotsLimit = 100;

export default function AdminConfigPage() {
  // Initial config
  const initialConfig: ParkingConfig = {
    facilityName: '',
    lotId: '',
    timezone: 'Asia/Jerusalem',
    surfaceSpotIds: [],
    totalSurfaceSpots: 0,
    dailyHours: {
      Sunday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
      Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
      Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
      Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
      Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
      Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
      Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
    },
    maxQueueSize: 0,
    avgRetrievalTime: 0,
    maxParallelRetrievals:0, 
    maintenanceMode: false,
    showAdminAnalytics: false
  };

  // State
  const [parkingConfig, setParkingConfig] = useState<ParkingConfig>(initialConfig);
  const [lastSavedConfig, setLastSavedConfig] = useState<ParkingConfig>(initialConfig);
  const [newSpotId, setNewSpotId] = useState('');
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState<{index: number, name: string} | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [updateLotId, setUpdateLotId] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [addingNewLot, setAddingNewLot] = useState(false);

  // Auto-hide error popup after 3 seconds
  useEffect(() => {
    if (showErrorPopup) {
      const timer = setTimeout(() => {
        setShowErrorPopup(false);
        setCurrentError(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [showErrorPopup]);

  // Add useEffect for auto-closing save message
  useEffect(() => {
    if (message && message.type === 'success') {
      const timer = setTimeout(() => {
        setMessage(null);
      }, 3000); // 3 seconds

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Functions
  const handleDayToggle = (day: string) => {
    setParkingConfig(prev => ({
      ...prev,
      dailyHours: {
        ...prev.dailyHours,
        [day]: {
          ...prev.dailyHours[day],
          isActive: !prev.dailyHours[day].isActive
        }
      }
    }));
  };

  const handleTimeChange = (day: string, timeType: 'openingHour' | 'closingHour', value: string) => {
    setParkingConfig(prev => ({
      ...prev,
      dailyHours: {
        ...prev.dailyHours,
        [day]: {
          ...prev.dailyHours[day],
          [timeType]: value
        }
      }
    }));
  };

  const addNewSpot = () => {
    const trimmedSpot = newSpotId.trim();
    if (!trimmedSpot) {
      setCurrentError('❌ Please enter a valid parking spot ID.');
      setShowErrorPopup(true);
      return;
    }
    if (parkingConfig.surfaceSpotIds.length >= maxSpotsLimit) {
      setCurrentError(`❌ You cannot add more than ${maxSpotsLimit} parking spots`);
      setShowErrorPopup(true);
      return;


    }
    if (parkingConfig.surfaceSpotIds.includes(trimmedSpot)) {
      setCurrentError('❌ This parking spot ID already exists.');
      setShowErrorPopup(true);
      return;
    }
    setParkingConfig(prev => ({
      ...prev,
      surfaceSpotIds: [...prev.surfaceSpotIds, trimmedSpot],
      totalSurfaceSpots: prev.surfaceSpotIds.length + 1
    }));
    setNewSpotId('');
    setShowAddSpot(false);
  };

  const removeSpot = (index: number) => {
    const spotName = parkingConfig.surfaceSpotIds[index];
    setSpotToDelete({ index, name: spotName });
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (spotToDelete) {
      setParkingConfig(prev => ({
        ...prev,
        surfaceSpotIds: prev.surfaceSpotIds.filter((_, i) => i !== spotToDelete.index),
        totalSurfaceSpots: prev.surfaceSpotIds.length - 1
      }));
    }
    setShowDeleteConfirm(false);
    setSpotToDelete(null);
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setSpotToDelete(null);
  };

  const handleResetClick = () => {
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    setShowResetConfirm(false);
    resetToDefaults();
  };

  const cancelReset = () => {
    setShowResetConfirm(false);
  };

  // Validate required fields with priority order
  const validateConfig = (): { isValid: boolean; firstError: string | null; allErrors: string[] } => {
    const errors: string[] = [];

    if (!parkingConfig.facilityName.trim()) {
      errors.push('Please enter a Facility Name');
    }

    if (!parkingConfig.lotId.trim()) {
      errors.push('Please enter a Lot ID');
    }

    if (parkingConfig.surfaceSpotIds.length === 0) {
      errors.push('Please add at least one parking spot');
    }

    // Check active days
    const activeDays = Object.keys(parkingConfig.dailyHours).filter(day =>
      parkingConfig.dailyHours[day].isActive
    );

    if (activeDays.length === 0) {
      errors.push('Please select at least one active day');
    }

    // Check hours for each active day
    for (const day of activeDays) {
      const dayData = parkingConfig.dailyHours[day];

      if (!dayData.openingHour || dayData.openingHour === '--:--') {
        errors.push(`Please set opening hour for ${day}`);
        break;
      }

      if (!dayData.closingHour || dayData.closingHour === '--:--') {
        errors.push(`Please set closing hour for ${day}`);
        break;
      }

      // Logical hours check
      const [openHour, openMin] = dayData.openingHour.split(':').map(Number);
      const [closeHour, closeMin] = dayData.closingHour.split(':').map(Number);
      const openMinutes = openHour * 60 + openMin;
      const closeMinutes = closeHour * 60 + closeMin;

      if (closeMinutes <= openMinutes) {
        errors.push(`Closing hour must be after opening hour for ${day}`);
        break;
      }
    }

    if (parkingConfig.maxQueueSize <= 0) {
      errors.push('Please set Max Queue Size to a number greater than 0');
    }

    if (parkingConfig.avgRetrievalTime <= 0) {
      errors.push('Please set Average Retrieval Time to a number greater than 0');
    }

    if (parkingConfig.maxParallelRetrievals <= 0) {
      errors.push('Please set Max Parallel Retrievals to a number greater than 0');
    }

    return {
      isValid: errors.length === 0,
      firstError: errors.length > 0 ? errors[0] : null,
      allErrors: errors
    };
  };
  const hasChanges = () => {
    const current = {
      facilityName: parkingConfig.facilityName,
      lotId: parkingConfig.lotId,
      timezone: parkingConfig.timezone,
      surfaceSpotIds: [...parkingConfig.surfaceSpotIds].sort(),
      dailyHours: parkingConfig.dailyHours,
      maxQueueSize: parkingConfig.maxQueueSize,
      avgRetrievalTime: parkingConfig.avgRetrievalTime,
      maxParallelRetrievals: parkingConfig.maxParallelRetrievals,
      maintenanceMode: parkingConfig.maintenanceMode,
      showAdminAnalytics: parkingConfig.showAdminAnalytics,
      totalSurfaceSpots: parkingConfig.totalSurfaceSpots
    };

    const lastSaved = {
      facilityName: lastSavedConfig.facilityName,
      lotId: lastSavedConfig.lotId,
      timezone: lastSavedConfig.timezone,
      surfaceSpotIds: [...lastSavedConfig.surfaceSpotIds].sort(),
      dailyHours: lastSavedConfig.dailyHours,
      maxQueueSize: lastSavedConfig.maxQueueSize,
      avgRetrievalTime: lastSavedConfig.avgRetrievalTime,
      maxParallelRetrievals: lastSavedConfig.maxParallelRetrievals,
      maintenanceMode: lastSavedConfig.maintenanceMode,
      showAdminAnalytics: lastSavedConfig.showAdminAnalytics,
      totalSurfaceSpots: lastSavedConfig.totalSurfaceSpots
    };

    return JSON.stringify(current) !== JSON.stringify(lastSaved);
  };

  const saveConfig = async () => {
    if (!hasChanges()) {
      setCurrentError('⚠️ No changes detected. Please make some changes before saving.');
      setShowErrorPopup(true);
      return; // Stop saving
    }

    // Second check - field validation
    const validation = validateConfig();
    if (!validation.isValid && validation.firstError) {
      setCurrentError(`❌ ${validation.firstError}`);
      setShowErrorPopup(true);
      return; // Stop here if there are errors
    }

    // Only if both checks passed - save
    setSaving(true);
    try {
      const now = new Date();
      const isNewLot = addingNewLot && (!lastSavedConfig.lotId || lastSavedConfig.lotId === '');

      const url = isNewLot
        ? '/api/admin'
        : `/api/admin/${parkingConfig.lotId}`; 

      const method = isNewLot ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          parkingConfig: {
            ...parkingConfig,
            totalSurfaceSpots: parkingConfig.surfaceSpotIds.length,
            avgRetrievalTimeMinutes: parkingConfig.avgRetrievalTime,
            operatingHours: parkingConfig.dailyHours,
            updatedAt: now,
            updatedBy: 'admin'
          }
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setCurrentError(data.error || '❌ Error saving configuration.');
        setShowErrorPopup(true);
        return;
      }

      setParkingConfig(prev => ({
        ...prev,
        totalSurfaceSpots: prev.surfaceSpotIds.length,
        updatedAt: now,
        updatedBy: 'admin'
      }));

      setLastSavedConfig({
        ...parkingConfig,
        totalSurfaceSpots: parkingConfig.surfaceSpotIds.length,
        updatedAt: now,
        updatedBy: 'admin'
      });

      setMessage({
        type: 'success',
        text: isNewLot
          ? '✅ New lot added successfully!'
          : '✅ Configuration saved successfully!'
      });
      setAddingNewLot(false);
    } catch (error) {
      setCurrentError('❌ Error saving configuration. Please try again.');
      setShowErrorPopup(true);
    } finally {
      setSaving(false);
    }
  };

  const resetToDefaults = () => {
    setParkingConfig({
      facilityName: '',
      lotId: '',
      timezone: 'Asia/Jerusalem',
      surfaceSpotIds: [],
      totalSurfaceSpots: 0,
      dailyHours: {
        Sunday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
        Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
      },
      maxQueueSize: 0,
      avgRetrievalTime: 0,
      maxParallelRetrievals: 0, 
      maintenanceMode: false,
      showAdminAnalytics: false,
      updatedAt: new Date(),
      updatedBy: 'admin'
    });
    setMessage({
      type: 'success',
      text: '🔄 Configuration reset to defaults!'
    });
  };

  const handleLoadForUpdate = async () => {
    if (!updateLotId.trim()) {
      setCurrentError('❌ Please enter a Lot ID to load.');
      setShowErrorPopup(true);
      return;
    }
    setLoadingUpdate(true);
    try {
      const res = await fetch(`/api/admin/${encodeURIComponent(updateLotId.trim())}`);
      const data = await res.json();
      if (!data.success || !data.parkingConfig) {
        setCurrentError('❌ Lot ID not found.');
        setShowErrorPopup(true);
      } else {
        setParkingConfig({
          ...data.parkingConfig,
          lotId: updateLotId.trim(),
          dailyHours: convertOperatingHoursToDailyHours(data.parkingConfig.operatingHours),
          avgRetrievalTime: data.parkingConfig.avgRetrievalTimeMinutes ?? 0,
          updatedAt: data.parkingConfig.updatedAt ? new Date(data.parkingConfig.updatedAt) : undefined,
        });
        setLastSavedConfig({
          ...data.parkingConfig,
          dailyHours: convertOperatingHoursToDailyHours(data.parkingConfig.operatingHours),
          avgRetrievalTime: data.parkingConfig.avgRetrievalTimeMinutes ?? 0,
          updatedAt: data.parkingConfig.updatedAt ? new Date(data.parkingConfig.updatedAt) : undefined,
        });
        setMessage({ type: 'success', text: '✅ Lot loaded for update!' });
      }
    } catch (err) {
      setCurrentError('❌ Error loading lot for update.');
      setShowErrorPopup(true);
    } finally {
      setLoadingUpdate(false);
    }
  };

  // Convert operating hours from various formats to the unified dailyHours structure
  function convertOperatingHoursToDailyHours(operatingHours: any): ParkingConfig['dailyHours'] {
    if (operatingHours && typeof operatingHours === 'object' && operatingHours.Sunday) {
      return operatingHours;
    }
    const start = operatingHours?.start || '00:00';
    const end = operatingHours?.end || '00:00';
    const daily: ParkingConfig['dailyHours'] = {};
    for (const day of days) {
      daily[day] = {
        isActive: true,
        openingHour: start,
        closingHour: end
      };
    }
    return daily;
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          {/* Header */}
          <Box textAlign="center" mb={4}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 400, 
              color: 'primary.main',
              borderBottom: '2px solid',
              borderColor: 'primary.main',
              pb: 2,
              mb: 4
            }}>
              Parking System Configuration
            </Typography>
          </Box>

          {/* Success Alert Message */}
          {message && message.type === 'success' && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(0,0,0,0.05)', // Transparent overlay
                zIndex: 1999,
                pointerEvents: 'auto'
              }}
            />
          )}

          {/* Save message in center */}
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

          {/* Overlay for Messages and Error Popup */}
          {(message || showErrorPopup) && (
            <Box
              sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                bgcolor: 'rgba(0,0,0,0.05)',
                zIndex: 1999,
                pointerEvents: 'auto'
              }}
            />
          )}

          {/* Main Cards - 2x2 Layout */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4, 
            mb: 4 
          }}>
            
            {/* Card 1 - Facility Information */}
            <StyledCard>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <InfoIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="h2">
                    1. Facility Information
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Facility Name"
                    placeholder="Enter facility name (e.g., Main Parking Center)"
                    value={parkingConfig.facilityName}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      facilityName: e.target.value
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Lot ID"
                    placeholder="Enter unique lot ID (e.g., main-lot-001)"
                    value={parkingConfig.lotId}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      lotId: e.target.value
                    }))}
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={parkingConfig.timezone}
                      label="Timezone"
                      onChange={(e) => setParkingConfig(prev => ({
                        ...prev,
                        timezone: e.target.value as string
                      }))}
                    >
                      {timezones.map((tz, index) => (
                        <MenuItem key={`timezone-${index}-${tz}`} value={tz}>{tz}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Stack>
              </CardContent>
            </StyledCard>

            {/* Card 2 - Parking Settings */}
            <StyledCard>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ParkingIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="h2">
                    2. Parking Settings
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Surface Spots Configuration:
                </Typography>
                
                {/* Add Spot Button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  fullWidth
                  onClick={() => setShowAddSpot(true)}
                  disabled={parkingConfig.surfaceSpotIds.length >= maxSpotsLimit}
                  sx={{ mb: 2 }}
                >
                  {parkingConfig.surfaceSpotIds.length >= maxSpotsLimit 
                    ? `🚫 Maximum spots reached (${maxSpotsLimit}/${maxSpotsLimit})` 
                    : `Add Spot (${parkingConfig.surfaceSpotIds.length}/${maxSpotsLimit})`
                  }
                </Button>

                {/* Add Spot Input */}
                {showAddSpot && (
                  <Box key="add-spot-input" sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter parking spot ID (e.g., S1, A-01, VIP-Premium)"
                      value={newSpotId}
                      onChange={(e) => setNewSpotId(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && addNewSpot()}
                      onBlur={addNewSpot}
                      autoFocus
                      size="small"
                    />
                  </Box>
                )}

                {/* Existing Spots */}
                <Typography variant="subtitle2" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ParkingIcon fontSize="small" />
                  Existing Spots ({parkingConfig.surfaceSpotIds.length} total):
                </Typography>
<Paper variant="outlined" sx={{ 
  height: 150, // Fixed height
  overflow: 'auto', 
  p: 1 
}}>
  {parkingConfig.surfaceSpotIds.length > 0 ? (
    <Stack spacing={1}>
      {parkingConfig.surfaceSpotIds.map((spot, index) => (
        <StyledChip
          key={`spot-${index}-${spot}-${parkingConfig.surfaceSpotIds.length}`}
          label={spot}
          onDelete={() => removeSpot(index)}
          deleteIcon={<DeleteIcon />}
          color="primary"
          variant="outlined"
          sx={{ 
            justifyContent: 'space-between', 
            width: '100%',
            height: 40, // Fixed height
            '&:hover': {
              backgroundColor: 'rgba(25, 118, 210, 0.08)' // Only color change, not size
            }
          }}
        />
      ))}
    </Stack>
  ) : (
    <Box sx={{ textAlign: 'center', py: 3, color: 'text.secondary' }}>
      <Typography variant="h4" component="div" sx={{ opacity: 0.3, mb: 1 }}>
        🚗
      </Typography>
      <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
        No parking spots added yet
      </Typography>
    </Box>
  )}
</Paper>
              </CardContent>
            </StyledCard>

            {/* Card 3 - Operating Hours */}
            <StyledCard>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <ScheduleIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="h2">
                    3. Operating Hours
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Typography variant="subtitle2" gutterBottom sx={{ mb: 3 }}>
                  Set active days and operating hours:
                </Typography>
                
                {/* Days with Hours in Same Row */}
                <Stack spacing={1.5}>
                  {days.map((day, index) => {
                    const dayData = parkingConfig.dailyHours[day]; // Add this missing line
                    return (
                      <Box 
                        key={`day-hours-${index}-${day}`}
                        sx={{ 
                          display: 'grid',
                          gridTemplateColumns: '120px 1fr 1fr', // checkbox | opening | closing
                          gap: 2,
                          alignItems: 'center',
                          p: 2,
                          border: '1px solid',
                          borderColor: dayData.isActive ? 'primary.main' : 'grey.300',
                          borderRadius: 2,
                          bgcolor: dayData.isActive ? 'rgba(25, 118, 210, 0.04)' : 'transparent',
                          transition: 'all 0.3s ease'
                        }}
                      >
                        {/* Day Checkbox - Compact */}
                        <Chip
                          label={day}
                          onClick={() => handleDayToggle(day)}
                          variant={dayData.isActive ? "filled" : "outlined"}
                          color={dayData.isActive ? "primary" : "default"}
                          size="small"
                          sx={{
                            height: 32,
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-1px)',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                            }
                          }}
                        />
                        
                        {/* Opening Hour - Always Visible */}
                        <TextField
                          size="small"
                          label="Opening"
                          type="time"
                          value={dayData.openingHour}
                          onChange={(e) => handleTimeChange(day, 'openingHour', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          disabled={!dayData.isActive} // Disabled if day is not active
                          sx={{
                            '& .MuiInputBase-input': {
                              color: dayData.isActive ? 'inherit' : 'text.secondary'
                            },
                            '& .MuiInputLabel-root': {
                              color: dayData.isActive ? 'inherit' : 'text.secondary'
                            }
                          }}
                        />
                        
                        {/* Closing Hour - Always Visible */}
                        <TextField
                          size="small"
                          label="Closing"
                          type="time"
                          value={dayData.closingHour}
                          onChange={(e) => handleTimeChange(day, 'closingHour', e.target.value)}
                          InputLabelProps={{ shrink: true }}
                          disabled={!dayData.isActive} // Disabled if day is not active
                          sx={{
                            '& .MuiInputBase-input': {
                              color: dayData.isActive ? 'inherit' : 'text.secondary'
                            },
                            '& .MuiInputLabel-root': {
                              color: dayData.isActive ? 'inherit' : 'text.secondary'
                            }
                          }}
                        />
                      </Box>
                    );
                  })}
                </Stack>
              </CardContent>
            </StyledCard>

            {/* Card 4 - Queue & Retrieval Management */}
            <StyledCard>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <QueueIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="h2">
                    4. Queue & Retrieval Management
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Max Queue Size"
                    type="number"
                    value={parkingConfig.maxQueueSize}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      maxQueueSize: parseInt(e.target.value) || 0
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Average Retrieval Time (minutes)"
                    type="number"
                    value={parkingConfig.avgRetrievalTime}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      avgRetrievalTime: parseInt(e.target.value) || 0
                    }))}
                  />
                  <TextField
                    fullWidth
                    label="Max Parallel Retrievals"
                    type="number"
                    value={parkingConfig.maxParallelRetrievals}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      maxParallelRetrievals: parseInt(e.target.value) || 0
                    }))}
                  />
                </Stack>
              </CardContent>
            </StyledCard>
          </Box>
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, 
            gap: 4, 
            mb: 4 
          }}>
            <StyledCard>
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <SettingsIcon />
                  </Avatar>
                }
                title={
                  <Typography variant="h6" component="h2">
                    5. System Settings
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={2}>
                  {/* Maintenance Mode as Radio */}
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                      Maintenance Mode
                    </Typography>
                    <RadioGroup
                      row
                      value={parkingConfig.maintenanceMode ? 'on' : 'off'}
                      onChange={(e) =>
                        setParkingConfig(prev => ({
                          ...prev,
                          maintenanceMode: e.target.value === 'on'
                        }))
                      }
                    >
                      <FormControlLabel
                        value="on"
                        control={<Radio color="primary" />}
                        label={<Typography color="primary">Active</Typography>}
                      />
                      <FormControlLabel
                        value="off"
                        control={<Radio color="primary" />}
                        label={<Typography color="primary">off</Typography>}
                      />
                    </RadioGroup>
                  </Box>
<Box>
  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
    Show Admin Analytics
  </Typography>
  <RadioGroup
    row
    value={parkingConfig.showAdminAnalytics ? 'on' : 'off'}
    onChange={(e) =>
      setParkingConfig(prev => ({
        ...prev,
        showAdminAnalytics: e.target.value === 'on'
      }))
    }
  >
    <FormControlLabel
      value="on"
      control={<Radio color="primary" />}
      label={<Typography color="primary">Active</Typography>}
    />
    <FormControlLabel
      value="off"
      control={<Radio color="primary" />}
      label={<Typography color="primary">off</Typography>}
    />
  </RadioGroup>
  
</Box>

                </Stack>
              </CardContent>
            </StyledCard>
          </Box>

          {/* Action Buttons */}
          <Divider sx={{ my: 3 }} />
          <Box sx={{ textAlign: 'center' }}>
            <Stack direction="row" spacing={2} justifyContent="center">
              <Button
                variant="contained"
                size="large"
                onClick={saveConfig}
                disabled={saving || !!message || showErrorPopup}
                startIcon={saving ? <TimeIcon /> : undefined}
                sx={{ minWidth: 200,
                  bgcolor: 'primary.main',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)',
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
                    transform: 'translateY(-2px) scale(1.03)'
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
                  ? 'Saving Configuration...'
                  : '💾 Save Configuration'
                }
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={handleResetClick}
                disabled={saving}
                sx={{
                  minWidth: 150,
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  fontWeight: 700,
                  letterSpacing: 1,
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  boxShadow: '0 2px 8px rgba(25, 118, 210, 0.07)',
                  '&:hover': {
                    bgcolor: 'primary.main',
                    color: 'white',
                    borderColor: 'primary.dark',
                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
                    transform: 'translateY(-2px) scale(1.03)'
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
                🔄 Reset to Defaults
              </Button>
            </Stack>
            {parkingConfig.updatedAt && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {(() => {
                  const d = new Date(parkingConfig.updatedAt);
                  const dateStr = d.toLocaleDateString('en-GB');
                  const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return `Last updated: Date: ${dateStr} Time: ${timeStr}`;
                })()}
              </Typography>
            )}
          </Box>
          {/* Load for Update Section */}
<Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
  <Button
    // variant="contained"
    // color="primary"
    onClick={() => {
      setParkingConfig(initialConfig);
      setLastSavedConfig(initialConfig);
      setAddingNewLot(true);
      setUpdateLotId('');
      setMessage(null);
    }}
     sx={{ minWidth: 200,
                  bgcolor: 'primary.main',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)',
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
                    transform: 'translateY(-2px) scale(1.03)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.400',
                    color: 'white',
                    boxShadow: 'none',
                    opacity: 0.7
                  }
                }}
  >
    + Add New Lot
  </Button>
  <TextField
    label="Lot ID to Update"
    size="small"
    value={updateLotId}
    onChange={e => setUpdateLotId(e.target.value)}
    disabled={loadingUpdate}
    sx={{ width: 220 }}
  />
  <Button
    variant="contained"
    color="secondary"
    onClick={handleLoadForUpdate}
    disabled={loadingUpdate || !updateLotId.trim()}
     sx={{ minWidth: 200,
                  bgcolor: 'primary.main',
                  color: 'white',
                  boxShadow: '0 4px 16px rgba(25, 118, 210, 0.10)',
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    bgcolor: 'primary.dark',
                    boxShadow: '0 8px 32px rgba(25, 118, 210, 0.18)',
                    transform: 'translateY(-2px) scale(1.03)'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'grey.400',
                    color: 'white',
                    boxShadow: 'none',
                    opacity: 0.7
                  }
                }}
  >
    {loadingUpdate ? 'Loading...' : 'Load for Update'}
  </Button>
</Box>

          {showDeleteConfirm && spotToDelete && (
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
                zIndex: 1400
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
                <Typography variant="h6" gutterBottom sx={{ 
                  fontWeight: 600,
                  color: '#d32f2f',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  ⚠️ Delete Confirmation
                </Typography>
                
                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  Are you sure you want to delete parking spot{' '}
                  <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
                    "{spotToDelete.name}"
                  </Box>
                  ?
                </Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  This action cannot be undone.
                </Typography>
                
                <Stack direction="row" spacing={2} justifyContent="flex-end">
                  <Button
                    variant="outlined"
                    onClick={cancelDelete}
                    sx={{ minWidth: 100 }}
                  >
                    Cancel
                  </Button>
                  
                  <Button
                    variant="contained"
                    color="error"
                    onClick={confirmDelete}
                    sx={{ 
                      minWidth: 100,
                      bgcolor: '#d32f2f',
                      '&:hover': {
                        bgcolor: '#b71c1c'
                      }
                    }}
                  >
                    Delete
                  </Button>
                </Stack>
              </Box>
            </Box>
          )}
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
                  Are you sure you want to reset all configuration to defaults?
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
          {showErrorPopup && currentError && (
            <Box
              sx={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1300,
                maxWidth: 500,
                bgcolor: 'error.main',
                color: 'white',
                p: 2,
                borderRadius: 3,
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                animation: 'slideIn 0.3s ease-out'
              }}
            >
              <Typography variant="body1" sx={{ mr: 2 }}>
                {currentError}
              </Typography>
            </Box>
          )}

        </Paper>
      </Container>
    </ThemeProvider>
  );
}









