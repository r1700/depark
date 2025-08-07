import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
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
  totalSpots: number;
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

interface AdminConfigPageProps {}

export default function AdminConfigPage({}: AdminConfigPageProps) {
  const navigate = useNavigate();
  const { lotId } = useParams<{ lotId?: string }>();
  
  // Initial config - memoized to prevent re-creation on every render
  const initialConfig: ParkingConfig = useMemo(() => ({
    facilityName: '',
    lotId: '',
    timezone: 'Asia/Jerusalem',
    surfaceSpotIds: [],
    totalSpots: 0,
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
  }), []);

  // State
  const [parkingConfig, setParkingConfig] = useState<ParkingConfig>(initialConfig);
  const [lastSavedConfig, setLastSavedConfig] = useState<ParkingConfig>(initialConfig);
  const [newSpotId, setNewSpotId] = useState('');
  const [showAddSpot, setShowAddSpot] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showErrorPopup, setShowErrorPopup] = useState(false);
  const [currentError, setCurrentError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [spotToDelete, setSpotToDelete] = useState<{index: number, name: string} | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [updateLotId, setUpdateLotId] = useState('');
  const [loadingUpdate, setLoadingUpdate] = useState(false);
  const [addingNewLot, setAddingNewLot] = useState(false);
  const [deleteConfirmDialog, setDeleteConfirmDialog] = useState<{
    open: boolean;
    lotData: any;
  }>({ open: false, lotData: null });

  // Load existing parking config if lotId is provided
  useEffect(() => {
    console.log('🔄 useEffect triggered with lotId:', lotId);
    
    const loadExistingConfig = async () => {
      if (lotId) {
        setLoading(true);
        try {
          console.log('🔄 Loading existing config for lotId:', lotId);
          const response = await fetch(`/api/admin/${lotId}`, {
            headers: {
              'Cache-Control': 'no-cache',
              'Pragma': 'no-cache'
            }
          });
          
          if (response.ok) {
            const result = await response.json();
            console.log('✅ Loaded existing config:', result);
            
            if (result.success && result.parkingConfig) {
              const config = result.parkingConfig;
              
              // Convert the loaded config to match our format
              const defaultDailyHours = {
                Sunday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
                Monday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
                Tuesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
                Wednesday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
                Thursday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
                Friday: { isActive: false, openingHour: '00:00', closingHour: '00:00' },
                Saturday: { isActive: false, openingHour: '00:00', closingHour: '00:00' }
              };
              
              const loadedConfig: ParkingConfig = {
                facilityName: config.facilityName || '',
                lotId: config.id || '',
                timezone: config.timezone || 'Asia/Jerusalem',
                surfaceSpotIds: config.surfaceSpotIds || [],
                totalSpots: config.totalSpots || 0,
                dailyHours: config.operatingHours || defaultDailyHours,
                avgRetrievalTime: config.avgRetrievalTimeMinutes || 0,
                maxQueueSize: config.maxQueueSize || 0,
                maxParallelRetrievals: config.maxParallelRetrievals || 1,
                maintenanceMode: config.maintenanceMode || false,
                showAdminAnalytics: config.showAdminAnalytics || false,
                updatedAt: config.updatedAt ? new Date(config.updatedAt) : undefined,
                updatedBy: config.updatedBy || 'admin'
              };
              
              setParkingConfig(loadedConfig);
              setLastSavedConfig(loadedConfig);
              console.log('✅ Config loaded and set:', loadedConfig);
            }
          } else {
            console.error('❌ Failed to load config:', response.status);
            setCurrentError(`Failed to load parking lot data: ${response.status}`);
            setShowErrorPopup(true);
          }
        } catch (error) {
          console.error('❌ Error loading config:', error);
          setCurrentError('Error loading parking lot data');
          setShowErrorPopup(true);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('💭 No lotId provided, staying with initial config');
        // Reset to initial config when no lotId (new lot)
        setParkingConfig(initialConfig);
        setLastSavedConfig(initialConfig);
      }
    };
    
    loadExistingConfig();
  }, [lotId]); // Remove initialConfig dependency

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
  const getAllParkingLots = async () => {
    try {
      console.log('🔄 FETCH_LOTS: Starting to fetch parking lots');
      const response = await fetch('/api/admin/', {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      console.log('🔄 FETCH_LOTS: Raw server response:', JSON.stringify(result, null, 2));
      
      if (result.success) {
        // Formats the data for the table with default values
        const formattedData = result.parkingConfigs.map((config: any) => ({
          id: config.id || '',
          facilityName: config.facilityName || 'No Name'
        }));
        
        console.log('🔄 FETCH_LOTS: Formatted data for table:', JSON.stringify(formattedData, null, 2));
        return formattedData;
      } else {
        console.error('API returned error:', result.error);
        return [];
      }
    } catch (error) {
      console.error('Error fetching parking lots:', error);
      return [];
    }
  };

  // Function to refresh the table
  const refreshTable = async () => {
    const parkingLots = await getAllParkingLots();
    setTableData(prev => ({ ...prev, rows: parkingLots || [] }));
  };

  // Example of how to prepare data for the table
  const [tableData, setTableData] = useState<{
    columns: Array<{ id: string; label: string }>;
    rows: Array<any>;
  }>({
    columns: [
      { id: 'id', label: 'ID' },
      { id: 'facilityName', label: 'Facility Name' }
    ],
    rows: []
  });

  // Load table data only once
  useEffect(() => {
    const loadData = async () => {
      const parkingLots = await getAllParkingLots();
      setTableData(prev => ({ ...prev, rows: parkingLots || [] }));
    };
    loadData();
  }, []); // Empty - will load only once

  // Function to load a specific lot for editing
  const loadLotForEdit = async (lotId: string) => {
    setLoadingUpdate(true);
    try {
      const res = await fetch(`/api/admin/${encodeURIComponent(lotId.trim())}`);
      const data = await res.json();
      if (!data.success || !data.parkingConfig) {
        setCurrentError('❌ Lot ID not found.');
        setShowErrorPopup(true);
      } else {
        const loadedConfig = {
          ...data.parkingConfig,
          lotId: lotId.trim(),
          dailyHours: convertOperatingHoursToDailyHours(data.parkingConfig.operatingHours),
          avgRetrievalTime: data.parkingConfig.avgRetrievalTimeMinutes ?? 0,
          maxParallelRetrievals: data.parkingConfig.maxParallelRetrievals ?? 1,
          maintenanceMode: data.parkingConfig.maintenanceMode ?? false,
          showAdminAnalytics: data.parkingConfig.showAdminAnalytics ?? false,
          updatedAt: data.parkingConfig.updatedAt ? new Date(data.parkingConfig.updatedAt) : undefined,
          updatedBy: data.parkingConfig.updatedBy || 'admin'
        };
        
        setParkingConfig(loadedConfig);
        setLastSavedConfig(loadedConfig);
        setAddingNewLot(false);
        setMessage({ type: 'success', text: '✅ Lot loaded for editing!' });
        
        // Clear the URL parameter after loading
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      setCurrentError('❌ Error loading lot for update.');
      setShowErrorPopup(true);
    } finally {
      setLoadingUpdate(false);
    }
  };

  
  const handleEdit = async(row: any) => {
    setLoadingUpdate(true);
    try {
      const res = await fetch(`/api/admin/${row.id}`);
      const data = await res.json();
      if (!data.success || !data.parkingConfig) {
        setCurrentError('❌ Lot ID not found.');
        setShowErrorPopup(true);
      } else {
        const convertedConfig = {
          ...data.parkingConfig,
          lotId: row.id,
          dailyHours: convertOperatingHoursToDailyHours(data.parkingConfig.operatingHours),
          avgRetrievalTime: data.parkingConfig.avgRetrievalTimeMinutes ?? 0,
          maxParallelRetrievals: data.parkingConfig.maxParallelRetrievals ?? 1,
          maintenanceMode: data.parkingConfig.maintenanceMode ?? false,
          showAdminAnalytics: data.parkingConfig.showAdminAnalytics ?? false,
          updatedAt: data.parkingConfig.updatedAt ? new Date(data.parkingConfig.updatedAt) : undefined,
          updatedBy: data.parkingConfig.updatedBy || 'admin'
        };
        
        setParkingConfig(convertedConfig);
        setLastSavedConfig(convertedConfig);
        setAddingNewLot(false);
        setMessage({ type: 'success', text: '✅ Lot loaded for update!' });
      }
    } catch (err) {
      setCurrentError('❌ Error loading lot for update.');
      setShowErrorPopup(true);
    } finally {
      setLoadingUpdate(false);
    }
  };

  const confirmDeleteLot = async () => {
    if (!deleteConfirmDialog.lotData) return;
    
    try {
      const response = await fetch(`/api/admin/${deleteConfirmDialog.lotData.id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        // Update the table immediately instead of reloading
        setTableData(prev => ({
          ...prev,
          rows: prev.rows.filter(row => row.id !== deleteConfirmDialog.lotData.id)
        }));
        setMessage({ type: 'success', text: '✅ Parking lot deleted successfully!' });
      } else {
        const errorData = await response.json();
        setCurrentError(`❌ Failed to delete: ${errorData.error || 'Unknown error'}`);
        setShowErrorPopup(true);
      }
    } catch (error) {
      console.error('Error deleting parking lot:', error);
      setCurrentError('❌ Network error while deleting parking lot');
      setShowErrorPopup(true);
    } finally {
      // Close the dialog
      setDeleteConfirmDialog({ open: false, lotData: null });
    }
  };

  const addNewSpot = () => {
    const trimmedSpot = newSpotId.trim();
    if (!trimmedSpot) {
      setCurrentError('❌ Please enter a valid parking spot ID.');
      setShowErrorPopup(true);
      return;
    }
    if (parkingConfig.totalSpots > 0 && parkingConfig.surfaceSpotIds.length >= parkingConfig.totalSpots) {
      setCurrentError(`❌ Cannot add more spots. Maximum capacity is ${parkingConfig.totalSpots} spots.`);
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
      surfaceSpotIds: [...prev.surfaceSpotIds, trimmedSpot]
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
        surfaceSpotIds: prev.surfaceSpotIds.filter((_, i) => i !== spotToDelete.index)
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

    if (parkingConfig.totalSpots <= 0) {
      errors.push('Please set Total Surface Spots Capacity to a number greater than 0');
    }

    return {
      isValid: errors.length === 0,
      firstError: errors.length > 0 ? errors[0] : null,
      allErrors: errors
    };
  };
  const hasChanges = () => {
    // Direct comparison of important fields (without dates)
    const changes = 
      parkingConfig.facilityName !== lastSavedConfig.facilityName ||
      parkingConfig.lotId !== lastSavedConfig.lotId ||
      parkingConfig.timezone !== lastSavedConfig.timezone ||
      parkingConfig.totalSpots !== lastSavedConfig.totalSpots ||
      parkingConfig.maxQueueSize !== lastSavedConfig.maxQueueSize ||
      parkingConfig.avgRetrievalTime !== lastSavedConfig.avgRetrievalTime ||
      parkingConfig.maxParallelRetrievals !== lastSavedConfig.maxParallelRetrievals ||
      parkingConfig.maintenanceMode !== lastSavedConfig.maintenanceMode ||
      parkingConfig.showAdminAnalytics !== lastSavedConfig.showAdminAnalytics ||
      JSON.stringify(parkingConfig.surfaceSpotIds.sort()) !== JSON.stringify(lastSavedConfig.surfaceSpotIds.sort()) ||
      JSON.stringify(parkingConfig.dailyHours) !== JSON.stringify(lastSavedConfig.dailyHours);

    console.log('🔄 hasChanges check:', changes, {
      facilityName: parkingConfig.facilityName + ' vs ' + lastSavedConfig.facilityName,
      equal: parkingConfig.facilityName === lastSavedConfig.facilityName
    });
    
    return changes;
  };

  const saveConfig = async () => {
    const validation = validateConfig();
    if (!validation.isValid && validation.firstError) {
      setCurrentError(`❌ ${validation.firstError}`);
      setShowErrorPopup(true);
      return; // Stop here if there are errors
    }

    // Only if validation passed - save
    setSaving(true);
    try {
      const now = new Date();
      // Check if this is a new lot - use React Router lotId instead of URL params
      const isNewLot = !lotId; // If no lotId from useParams, it's a new lot

      console.log('🔄 CRITICAL_SAVE_DEBUG: Starting save process');
      console.log('🔄 Current parkingConfig:', JSON.stringify(parkingConfig, null, 2));
      console.log('🔄 lotId from useParams:', lotId);
      console.log('🔄 isNewLot:', isNewLot);
      console.log('🔄 Sending timestamp:', now.toISOString());

      const url = isNewLot
        ? '/api/admin'
        : `/api/admin/${lotId}`; // Use lotId from useParams

      const method = isNewLot ? 'POST' : 'PUT';

      // Preparing data for submission
      const dataToSend = {
        parkingConfig: {
          ...parkingConfig,
          avgRetrievalTimeMinutes: parkingConfig.avgRetrievalTime,
          maxParallelRetrievals: parkingConfig.maxParallelRetrievals,
          operatingHours: parkingConfig.dailyHours,
          maintenanceMode: parkingConfig.maintenanceMode,
          showAdminAnalytics: parkingConfig.showAdminAnalytics,
          updatedAt: now,
          updatedBy: 'admin'
        }
      };

      console.log('🔄 CRITICAL_DATA_TO_SEND:', JSON.stringify(dataToSend, null, 2));
      console.log('🔄 URL:', url);
      console.log('🔄 Method:', method);

      const response = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache' 
        },
        body: JSON.stringify(dataToSend)
      });

      console.log('🔄 Response status:', response.status);
      console.log('🔄 Response ok:', response.ok);

      const data = await response.json();
      console.log('🔄 CRITICAL_SERVER_RESPONSE:', JSON.stringify(data, null, 2));

      if (!response.ok) {
        console.error('❌ Server error:', data);
        setCurrentError(data.error || '❌ Error saving configuration.');
        setShowErrorPopup(true);
        return;
      }

      // Creating the new update
      const newConfig = {
        ...parkingConfig,
        updatedAt: now,
        updatedBy: 'admin'
      };

      console.log('🔄 CRITICAL_NEW_CONFIG:', JSON.stringify(newConfig, null, 2));

      // Update both states
      setParkingConfig(newConfig);
      setLastSavedConfig(newConfig);

      setMessage({
        type: 'success',
        text: isNewLot
          ? '✅ New lot added successfully!'
          : '✅ Configuration saved successfully!'
      });
      setAddingNewLot(false);
      
      // Always update the table after saving
      console.log('🔄 CRITICAL_TABLE_UPDATE: Refreshing table after save');
      const updatedLots = await getAllParkingLots();
      setTableData(prev => ({ ...prev, rows: updatedLots || [] }));
      console.log('🔄 CRITICAL_TABLE_UPDATE: New table data:', JSON.stringify(updatedLots, null, 2));

    } catch (error) {
      console.error('❌ Save error:', error);
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
      totalSpots: 0,
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
        const loadedConfig = {
          ...data.parkingConfig,
          lotId: updateLotId.trim(),
          dailyHours: convertOperatingHoursToDailyHours(data.parkingConfig.operatingHours),
          avgRetrievalTime: data.parkingConfig.avgRetrievalTimeMinutes ?? 0,
          maxParallelRetrievals: data.parkingConfig.maxParallelRetrievals ?? 1,
          maintenanceMode: data.parkingConfig.maintenanceMode ?? false,
          showAdminAnalytics: data.parkingConfig.showAdminAnalytics ?? false,
          updatedAt: data.parkingConfig.updatedAt ? new Date(data.parkingConfig.updatedAt) : undefined,
          updatedBy: data.parkingConfig.updatedBy || 'admin'
        };
        
        setParkingConfig(loadedConfig);
        setLastSavedConfig(loadedConfig);
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
            {/* Back Button */}
            <Box sx={{ textAlign: 'left', mb: 2 }}>
              <Button
                variant="outlined"
                onClick={() => navigate('/parkings')}
                sx={{ 
                  color: 'primary.main',
                  borderColor: 'primary.main',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                    color: 'white'
                  }
                  }}
                >
                  ← Back to Parking Lots
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
              {lotId ? `Edit Parking Lot: ${parkingConfig.facilityName || lotId}` : 'New Parking System Configuration'}
            </Typography>
          </Box>

          {/* Loading indicator */}
          {loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
              <Typography variant="h6" sx={{ color: 'primary.main' }}>
                Loading parking lot data...
              </Typography>
            </Box>
          )}

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
          {/* <DataTable 
                data={tableData} 
                onEdit={handleEdit}
                onDelete={handleDelete}
              /> */}

         
          
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
                    value={parkingConfig.facilityName || ''}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      facilityName: e.target.value
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Lot ID"
                    placeholder="Enter unique lot ID (e.g., main-lot-001)"
                    value={parkingConfig.lotId || ''}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      lotId: e.target.value
                    }))}
                  />
                  
                  <FormControl fullWidth>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={parkingConfig.timezone || 'Asia/Jerusalem'}
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
                 <TextField
                    fullWidth
                    label="Total Surface Spots Capacity"
                    type="number"
                    value={parkingConfig.totalSpots || 0}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      totalSpots: parseInt(e.target.value) || 0
                    }))}
                  />
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
                  disabled={parkingConfig.totalSpots > 0 && parkingConfig.surfaceSpotIds.length >= parkingConfig.totalSpots}
                  sx={{ mb: 2 }}
                >
                  {parkingConfig.totalSpots > 0 && parkingConfig.surfaceSpotIds.length >= parkingConfig.totalSpots
                    ? `🚫 Maximum capacity reached (${parkingConfig.surfaceSpotIds.length}/${parkingConfig.totalSpots})`
                    : `Add Spot (${parkingConfig.surfaceSpotIds.length}/${parkingConfig.totalSpots || 'unlimited'})`
                  }
                </Button>

                {/* Add Spot Input */}
                {showAddSpot && (
                  <Box key="add-spot-input" sx={{ mb: 2 }}>
                    <TextField
                      fullWidth
                      placeholder="Enter parking spot ID (e.g., S1, A-01, VIP-Premium)"
                      value={newSpotId || ''}
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
                          value={dayData.openingHour || '00:00'}
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
                          value={dayData.closingHour || '00:00'}
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
                    4. Queue and Retrieval Management
                  </Typography>
                }
              />
              <CardContent sx={{ pt: 0 }}>
                <Stack spacing={3}>
                  <TextField
                    fullWidth
                    label="Max Queue Size"
                    type="number"
                    value={parkingConfig.maxQueueSize || 0}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      maxQueueSize: parseInt(e.target.value) || 0
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Average Retrieval Time (minutes)"
                    type="number"
                    value={parkingConfig.avgRetrievalTime || 0}
                    onChange={(e) => setParkingConfig(prev => ({
                      ...prev,
                      avgRetrievalTime: parseInt(e.target.value) || 0
                    }))}
                  />
                  
                  <TextField
                    fullWidth
                    label="Max Parallel Retrievals"
                    type="number"
                    value={parkingConfig.maxParallelRetrievals || 0}
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
                        label={<Typography color="primary">Off</Typography>}
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
      label={<Typography color="primary">Off</Typography>}
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
                disabled={saving || !!message || showErrorPopup || !hasChanges()}
                startIcon={saving ? <TimeIcon /> : undefined}
                sx={{ minWidth: 200,
                  bgcolor: hasChanges() ? 'primary.main' : 'grey.400',
                  color: 'white',
                  boxShadow: hasChanges() ? '0 4px 16px rgba(25, 118, 210, 0.10)' : 'none',
                  borderRadius: 3,
                  fontWeight: 700,
                  letterSpacing: 1,
                  transition: 'all 0.3s cubic-bezier(0.4,0,0.2,1)',
                  '&:hover': {
                    bgcolor: hasChanges() ? 'primary.dark' : 'grey.500',
                    boxShadow: hasChanges() ? '0 8px 32px rgba(25, 118, 210, 0.18)' : 'none',
                    transform: hasChanges() ? 'translateY(-2px) scale(1.03)' : 'none'
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
                  : hasChanges() 
                    ? '💾 Save Settings' 
                    : '✅ No Changes to Save'
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
                🔄 Reset to Default Settings
              </Button>
            </Stack>
            {(parkingConfig.updatedAt || lotId) && (
              <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
                {parkingConfig.updatedAt ? (() => {
                  const d = new Date(parkingConfig.updatedAt);
                  const dateStr = d.toLocaleDateString('en-GB');
                  const timeStr = d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
                  return `Last updated: ${dateStr} at ${timeStr}${parkingConfig.updatedBy ? ` by ${parkingConfig.updatedBy}` : ''}`;
                })() : lotId ? `Configuration loaded for lot: ${lotId}` : 'New configuration'}
              </Typography>
            )}
          </Box>
          
          {/* Load for Update Section */}
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
          {deleteConfirmDialog.open && (
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
      zIndex: 1600
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
      <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: '#d32f2f' }}>
        ⚠️ Delete Parking Lot
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Are you sure you want to delete parking lot{' '}
        <Box component="span" sx={{ fontWeight: 600, color: 'primary.main' }}>
          "{deleteConfirmDialog.lotData?.facilityName || deleteConfirmDialog.lotData?.id}"
        </Box>
        ?
      </Typography>
      <Stack direction="row" spacing={2} justifyContent="flex-end">
        <Button
          variant="outlined"
          onClick={() => setDeleteConfirmDialog({ open: false, lotData: null })}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={confirmDeleteLot}
        >
          Delete
        </Button>
      </Stack>
    </Box>
  </Box>
)}

        </Paper>
      </Container>
    </ThemeProvider>
  );
}