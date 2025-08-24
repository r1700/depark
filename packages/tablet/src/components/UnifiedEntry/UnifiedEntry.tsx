import { useState, useEffect, useMemo } from 'react';
import { sampleVehicles, employeeVehiclesMap } from '../../data';
import { Box, Typography, Autocomplete, TextField, InputAdornment, Button, IconButton, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import { useNavigate } from 'react-router-dom';
import './UnifiedEntry.css';
import { ESTIMATED_TIME_PER_VEHICLE } from '../../data';
import { sendVehicleData } from '../../services/api';

const PopupMessage = ({ message, color }: { message: string; color: 'error' | 'success' }) => (
    <Box className={`popup-message ${color}`}>
        <Typography variant="body1">{message}</Typography>
    </Box>
);

export default function UnifiedEntry() {
    const navigate = useNavigate();
    const [employeeId, setEmployeeId] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const [employeeVehicles, setEmployeeVehicles] = useState<{ licensePlate: string }[]>([]);
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [queues, setQueues] = useState<any[]>([]);
    const [userVehicle, setUserVehicle] = useState('');
    const [popup, setPopup] = useState<{ message: string; color: 'error' | 'success' } | null>(null);
    const [openModal, setOpenModal] = useState(false);

    const flatSampleVehicles = useMemo(() => sampleVehicles.flat(), []);
    const employeeIds = useMemo(() => Object.keys(employeeVehiclesMap), []);
    const licensePlates = useMemo(() => flatSampleVehicles.map(v => v.licensePlate), [flatSampleVehicles]);
    const floorNumber = localStorage.getItem("floorNumber");

    const showPopup = (message: string, color: 'error' | 'success') => setPopup({ message, color });

    const resetSearch = () => {
        setEmployeeVehicles([]);
        setSelectedVehicle('');
        setQueues(sampleVehicles);
        setUserVehicle('');
    };

    const handleSearch = async (type: 'plate' | 'employee', value: string) => {
        resetSearch();
        if (!value)
            return showPopup(`Please enter a ${type === 'plate' ? 'license plate' : '5-digit employee ID'}`, 'error');
        if (type === 'plate') {            
            let found = false;
            let queueIndex = -1;
            let positionInQueue = -1;

            for (let i = 0; i < sampleVehicles.length; i++) {
                const pos = sampleVehicles[i].findIndex(v => v.licensePlate === value);
                if (pos !== -1) {
                    found = true;
                    queueIndex = i;
                    positionInQueue = pos;
                    break;
                }
            }
            setUserVehicle(value);
            if (!found) {
                return showPopup('Vehicle not found in the system', 'error');
            }

            const waitTime = positionInQueue * ESTIMATED_TIME_PER_VEHICLE;
            showPopup(
                `Vehicle is in queue #${queueIndex + 1} at position ${positionInQueue + 1} — Estimated wait time: ${waitTime} minutes`, 'success'
            );
        }

        if (type === 'employee') {
            if (employeeVehiclesMap[value].length===0)
                return showPopup('No vehicles found for this employee', 'error');

            setEmployeeVehicles(employeeVehiclesMap[value]);
            setOpenModal(true);
        }

        try {
            await sendVehicleData({
                licensePlate: value,
                floorNumber: floorNumber
            });
        } catch (err) {
            console.error("Failed to send data to API", err);
        }

        return;
    };

    const handleVehicleSelect = (plate: string) => {
        setSelectedVehicle(plate);
        setLicensePlate(plate);
        setOpenModal(false);
        handleSearch('plate', plate);

    };

    useEffect(() => {
        setQueues(sampleVehicles);
    }, []);

    useEffect(() => {
        if (popup) {
            const timer = setTimeout(() => setPopup(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [popup]);

    return (
        <div className="license-plate-input-unified">
            <form className="search-form" onSubmit={e => { e.preventDefault(); handleSearch('employee', employeeId); }}>
                <Autocomplete
                    freeSolo
                    options={employeeIds}
                    inputValue={employeeId}
                    onInputChange={(_, v) => { setEmployeeId(v); if (v) setLicensePlate(''); }}
                    filterOptions={(o, { inputValue }) => inputValue ? o.filter(opt => opt.includes(inputValue)) : []}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Enter employee ID"
                            disabled={!!licensePlate}
                            className="autocomplete-textfield"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleSearch('employee', employeeId)}>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                        {employeeId && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setEmployeeId('')}>
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )}
                                    </>
                                )
                            }}
                        />
                    )}
                />
            </form>

            <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                <DialogTitle>Select a vehicle</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Choose a vehicle from the list below:</Typography>
                    {employeeVehicles.map((vehicle) => (
                        <Button
                            key={vehicle.licensePlate}
                            variant="outlined"
                            onClick={() => handleVehicleSelect(vehicle.licensePlate)}
                            style={{ margin: '5px' }}
                        >
                            {vehicle.licensePlate}
                        </Button>
                    ))}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            <form className="search-form" onSubmit={e => { e.preventDefault(); handleSearch('plate', licensePlate); }}>
                <Autocomplete
                    freeSolo
                    options={licensePlates}
                    inputValue={licensePlate}
                    onInputChange={(_, v) => { setLicensePlate(v); if (v) setEmployeeId(''); }}
                    filterOptions={(o, { inputValue }) => inputValue ? o.filter(opt => opt.includes(inputValue)) : []}
                    renderInput={params => (
                        <TextField
                            {...params}
                            label="Enter license plate"
                            disabled={!!employeeId}
                            className="autocomplete-textfield"
                            InputProps={{
                                ...params.InputProps,
                                endAdornment: (
                                    <>
                                        <InputAdornment position="end">
                                            <IconButton onClick={() => handleSearch('plate', licensePlate)}>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                        {licensePlate && (
                                            <InputAdornment position="end">
                                                <IconButton onClick={() => setLicensePlate('')}>
                                                    <ClearIcon />
                                                </IconButton>
                                            </InputAdornment>
                                        )}
                                    </>
                                )
                            }}
                        />
                    )}
                />
            </form>

            <Button
                variant="contained" className="show-queues-btn"
                onClick={() => { navigate('/VehicleQueue', { state: { queues, userVehicle } }) }}>
                Show queues
            </Button>

            {popup && <PopupMessage message={popup.message} color={popup.color} />}
        </div>
    );
}