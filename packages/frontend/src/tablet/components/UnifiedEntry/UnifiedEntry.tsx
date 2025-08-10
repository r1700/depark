import React, { useState, useEffect } from 'react';
import VehicleQueue from '../VehicleQueue/VehicleQueue';
import { sampleVehicles, employeeVehiclesMap } from '../../data';
import { Box, Typography, MenuItem, Select, InputLabel, FormControl, SelectChangeEvent, Autocomplete, TextField, InputAdornment } from '@mui/material';
import './UnifiedEntry.css';
import SearchIcon from '@mui/icons-material/Search';


const PopupMessage = ({ message, color }: { message: string; color: 'error' | 'success' }) => (
    <Box
        sx={{
            position: 'fixed',
            bottom: 20,
            right: 20,
            zIndex: 1300,
            maxWidth: 500,
            bgcolor: `${color}.main`,
            color: 'white',
            p: 2,
            borderRadius: 3,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            animation: color === 'success' ? 'fadeIn 0.5s ease-out' : 'slideIn 0.3s ease-out',
        }}
    >
        <Typography variant="body1" sx={{ mr: 2 }}>
            {message}
        </Typography>
    </Box>
);

const UnifiedEntry = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [employeeAutocompleteOpen, setEmployeeAutocompleteOpen] = useState(false);
    const [licensePlate, setLicensePlate] = useState('');
    const [employeeVehicles, setEmployeeVehicles] = useState<{ licensePlate: string }[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState<string>('');
    const [queue, setQueue] = useState<any[]>([]);
    const [userVehicle, setUserVehicle] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [popup, setPopup] = useState<{ message: string; color: 'error' | 'success' } | null>(null);
    
    const handleVehicleSelect = (e: SelectChangeEvent<string>) => {
        const licensePlate = e.target.value;
        setSelectedVehicle(licensePlate);
        setUserVehicle(licensePlate);
        setQueue(sampleVehicles);
        const foundVehicle = sampleVehicles.find((v) => v.licensePlate === licensePlate);
        if (!foundVehicle) {
            setPopup({ message: 'The vehicle is not found in the system', color: 'error' });
        } else {
            const vehicleIndex = sampleVehicles.findIndex((v: { licensePlate: string }) => v.licensePlate === licensePlate);
            setPopup({ message: `The vehicle is in the queue at position ${vehicleIndex + 1}`, color: 'success' });
        }
    };
    useEffect(() => {
        if (popup) {
            const timer = setTimeout(() => setPopup(null), 3000);
            return () => clearTimeout(timer);
        }
    }, [popup]);
    const employeeIds = Object.keys(employeeVehiclesMap);
    const licensePlates = sampleVehicles.map((v) => v.licensePlate);
    return (
        <div className="license-plate-input-unified">
            <div className="search-bar-wrapper">
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (!licensePlate) {
                            setPopup({ message: 'Please enter a license plate', color: 'error' });
                            setEmployeeVehicles([]);
                            setSelectedVehicle('');
                            setQueue([]);
                            setUserVehicle('');
                            return;
                        }
                        const foundVehicle = sampleVehicles.find((v) => v.licensePlate === licensePlate);
                        setEmployeeVehicles([]);
                        setSelectedVehicle('');
                        setUserVehicle(licensePlate);
                        setQueue(sampleVehicles);
                        if (!foundVehicle) {
                            setPopup({ message: 'Vehicle not found in the system', color: 'error' });
                        } else {
                            const vehicleIndex = sampleVehicles.findIndex((v) => v.licensePlate === licensePlate);
                            setPopup({ message: `Vehicle is in the queue at position ${vehicleIndex + 1}`, color: 'success' });
                        }
                    }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}
                >
                    <Autocomplete
    freeSolo
    options={licensePlates}
    inputValue={licensePlate}
    onInputChange={(_, value) => {
        setLicensePlate(value);
        if (value) {
            setEmployeeId('');
        } else {
            setQueue([]);
            setUserVehicle('');
        }
    }}
    open={!!licensePlate}
    openOnFocus={false}
    filterOptions={(options, { inputValue }) =>
        inputValue ? options.filter(option => option.includes(inputValue)) : []
    }
    renderInput={(params) => (
        <TextField
            {...params}
            className="input-field"
            label="Enter license plate"
            variant="outlined"
            disabled={!!employeeId}
            InputProps={{
                ...params.InputProps,
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon
                            sx={{ fontSize: 20, cursor: 'pointer' }}
                            onClick={() => {
                                if (licensePlate) {
                                    const foundVehicle = sampleVehicles.find((v) => v.licensePlate === licensePlate);
                                    setEmployeeVehicles([]);
                                    setSelectedVehicle('');
                                    setUserVehicle(licensePlate);
                                    setQueue(sampleVehicles);
                                    if (!foundVehicle) {
                                        setPopup({ message: 'Vehicle not found in the system', color: 'error' });
                                    } else {
                                        const vehicleIndex = sampleVehicles.findIndex((v: { licensePlate: string }) => v.licensePlate === licensePlate);
                                        setPopup({ message: `Vehicle is in the queue at position ${vehicleIndex + 1}`, color: 'success' });
                                    }
                                } else {
                                    setPopup({ message: 'Please enter a license plate', color: 'error' });
                                }
                            }}
                        />
                    </InputAdornment>
                ),
            }}
        />
    )}
    disabled={!!employeeId}
/>
                </form>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (!/^\d{5}$/.test(employeeId)) {
                            setPopup({ message: 'Please enter a 5-digit employee ID', color: 'error' });
                            setEmployeeVehicles([]);
                            setSelectedVehicle('');
                            setQueue([]);
                            setUserVehicle('');
                            return;
                        }
                        if (!employeeVehiclesMap[employeeId]) {
                            setEmployeeVehicles([]);
                            setSelectedVehicle('');
                            setQueue([]);
                            setUserVehicle('');
                            setPopup({ message: 'No vehicles found for this employee', color: 'error' });
                        } else {
                            setEmployeeVehicles(employeeVehiclesMap[employeeId]);
                            setSelectedVehicle('');
                            setQueue([]);
                            setUserVehicle('');
                            setPopup(null);
                        }
                    }}
                    style={{ width: '100%', display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '0.5rem' }}
                >
                    <Autocomplete
    freeSolo
    options={employeeIds}
    inputValue={employeeId}
    onInputChange={(_, value, reason) => {
        setEmployeeId(value);
        if (value) setLicensePlate('');
        if (reason === 'reset') setEmployeeAutocompleteOpen(false);
        else setEmployeeAutocompleteOpen(!!value);
    }}
    onOpen={() => setEmployeeAutocompleteOpen(true)}
    onClose={() => setEmployeeAutocompleteOpen(false)}
    open={employeeAutocompleteOpen}
    openOnFocus={false}
    filterOptions={(options, { inputValue }) =>
        inputValue ? options.filter(option => option.includes(inputValue)) : []
    }
    onChange={(_, value) => {
        if (value) {
            setEmployeeId(value);
            setEmployeeAutocompleteOpen(false);
            setLicensePlate('');
        }
    }}
    renderInput={(params) => (
        <TextField
            {...params}
            className="input-field"
            label="Enter employee ID"
            variant="outlined"
            disabled={!!licensePlate}
            InputProps={{
                ...params.InputProps,
                startAdornment: (
                    <InputAdornment position="start">
                        <SearchIcon
                            sx={{ fontSize: 20, cursor: 'pointer' }}
                            onClick={() => {
                                if (employeeId) {
                                    if (!employeeVehiclesMap[employeeId]) {
                                        setPopup({ message: 'No vehicles found for this employee', color: 'error' });
                                    } else {
                                        setEmployeeVehicles(employeeVehiclesMap[employeeId]);
                                        setPopup(null);
                                    }
                                } else {
                                    setPopup({ message: 'Please enter a 5-digit employee ID', color: 'error' });
                                }
                            }}
                        />
                    </InputAdornment>
                ),
            }}
        />
    )}
    disabled={!!licensePlate}
/>                  
                </form>
                {employeeVehicles.length > 0 && (
                    <FormControl
                        sx={{ mt: 2, minWidth: 180, width: '100%', maxWidth: 260, marginLeft: 'auto', marginRight: 'auto', display: 'block' }}
                        className="rounded-select-form"
                    >
                        <InputLabel id="vehicle-select-label">Select vehicle</InputLabel>
                        <Select
                            labelId="vehicle-select-label"
                            value={selectedVehicle}
                            label="Select vehicle"
                            onChange={handleVehicleSelect}
                            aria-label="Select vehicle"
                            className="rounded-select"
                            MenuProps={{
                                PaperProps: {
                                    className: 'rounded-select-dropdown',
                                    style: { borderRadius: '1.2rem', minWidth: 180, maxWidth: 260, width: 260 }
                                }
                            }}>
                            {employeeVehicles.map((v) => (
                                <MenuItem key={v.licensePlate} value={v.licensePlate}>{v.licensePlate}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                )}
            </div>
            <div className="queue-section">
                {userVehicle && queue.length > 0 &&
                    !error && !(popup && popup.color === 'error') && (
                        <VehicleQueue vehicles={queue} userVehicle={userVehicle} />
                    )}
            </div>
            {error && <PopupMessage message={error} color="error" />}
            {popup && <PopupMessage message={popup.message} color={popup.color} />}
        </div>
    );
};
export default UnifiedEntry;

