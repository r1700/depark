import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Tooltip, Paper, Menu, MenuItem, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import './UnifiedEntry.css';
import { sendVehicleData, sendFloorQueues, sendEmployeeVehicles } from '../../services/api';

// VoiceInput logic
const DIGITS_HE: Record<string, string> = {
    'אפס': '0', 'אחד': '1', 'אחת': '1', 'שתיים': '2', 'שניים': '2', 'שתים': '2', 'שתי': '2',
    'שלוש': '3', 'שלושה': '3', 'ארבע': '4', 'ארבעה': '4', 'חמש': '5', 'חמישה': '5',
    'שש': '6', 'שישה': '6', 'שבע': '7', 'שבעה': '7', 'שמונה': '8', 'תשע': '9', 'תשעה': '9'
};
const DIGITS_EN: Record<string, string> = {
    zero: '0', one: '1', two: '2', three: '3', four: '4', five: '5', six: '6', seven: '7', eight: '8', nine: '9',
    oh: '0', o: '0', to: '2', too: '2', for: '4', ate: '8'
};
const STOPWORDS_EN = new Set(['and', 'dash', 'hyphen', 'space', 'plate', 'number', 'license', 'car', 'my', 'is', 'the']);
function extractDigits(raw: string) {
    const tokens = raw
        .toLowerCase()
        .replace(/[^\wא-ת]/g, ' ')
        .split(/\s+/)
        .filter(Boolean)
        .filter(t => !STOPWORDS_EN.has(t));
    const out: string[] = [];
    for (const t of tokens) {
        if (DIGITS_HE[t]) out.push(DIGITS_HE[t]);
        else if (DIGITS_EN[t]) out.push(DIGITS_EN[t]);
        else {
            const digits = t.replace(/[^0-9]/g, '');
            if (digits) out.push(digits);
        }
    }
    return out.join('').slice(0, 8);
}
const formatPlate = (digits: string) => {
    if (digits.length === 7) return `${digits.slice(0, 2)}-${digits.slice(2, 5)}-${digits.slice(5)}`;
    if (digits.length === 8) return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
    return digits;
};
type Lang = 'he-IL' | 'en-US';
type VoiceProps = {
    inputRef: React.RefObject<HTMLInputElement | null>;
    onChange: (value: string) => void;
    currentValue: string;
    lang?: Lang;
};
const VoiceInput: React.FC<VoiceProps> = ({ inputRef, onChange, currentValue, lang: initialLang = 'he-IL' }) => {
    const [supported, setSupported] = useState(false);
    const [listening, setListening] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lang, setLang] = useState<Lang>(initialLang);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const recognitionRef = useRef<any>(null);
    const errorTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const w = window as any;
        const SR = w.SpeechRecognition || w.webkitSpeechRecognition || null;
        if (SR) {
            recognitionRef.current = new SR();
            setSupported(true);
        }
    }, []);
    useEffect(() => {
        if (error) {
            if (errorTimeoutRef.current) clearTimeout(errorTimeoutRef.current);
            errorTimeoutRef.current = setTimeout(() => {
                setError(null);
                errorTimeoutRef.current = null;
            }, 4000);
        }
    }, [error]);
    const startListening = () => {
        const rec = recognitionRef.current;
        if (!rec) return;
        setError(null);
        setListening(true);
        rec.lang = lang;
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.continuous = false;
        let speechDetected = false;
        const timeout = setTimeout(() => {
            if (!speechDetected) {
                try { rec.stop(); } catch { }
                setError('No speech detected');
                setListening(false);
            }
        }, 5000);
        rec.onstart = () => { speechDetected = false; };
        rec.onspeechstart = () => { speechDetected = true; };
        rec.onresult = (e: any) => {
            clearTimeout(timeout);
            const transcript = e.results?.[0]?.[0]?.transcript || '';
            const conf = e.results?.[0]?.[0]?.confidence || 0;
            if (!transcript || conf < (lang === 'en-US' ? 0.2 : 0.6)) {
                setError('Could not recognize plate');
                setListening(false);
                return;
            }
            const spokenDigits = extractDigits(transcript);
            if (!spokenDigits) {
                setError('No digits recognized');
                setListening(false);
                return;
            }
            const currentDigits = currentValue.replace(/[^0-9]/g, '');
            if (currentDigits.length >= 8) {
                setError('Cannot add more digits');
                setListening(false);
                return;
            }
            const input = inputRef.current;
            let pos = currentDigits.length;
            if (input) {
                const rawPos = input.selectionStart ?? 0;
                let digitPos = 0;
                for (let i = 0; i < rawPos && i < currentValue.length; i++) {
                    if (/\d/.test(currentValue[i])) digitPos++;
                }
                pos = digitPos;
            }
            let toAdd = spokenDigits.slice(0, 8 - currentDigits.length);
            let newDigits: string;
            if (pos <= 0) newDigits = toAdd + currentDigits;
            else if (pos >= currentDigits.length) newDigits = currentDigits + toAdd;
            else newDigits = currentDigits.slice(0, pos) + toAdd + currentDigits.slice(pos);
            newDigits = newDigits.slice(0, 8);
            const formatted = formatPlate(newDigits);
            onChange(formatted);
            setTimeout(() => {
                if (input) {
                    let digitsBefore = pos + toAdd.length;
                    let newCursor = 0, digitsCount = 0;
                    for (let i = 0; i < formatted.length; i++) {
                        if (/\d/.test(formatted[i])) digitsCount++;
                        if (digitsCount === digitsBefore) {
                            newCursor = i + 1;
                            break;
                        }
                    }
                    if (digitsBefore === 0) newCursor = 0;
                    if (digitsBefore >= newDigits.length) newCursor = formatted.length;
                    input.setSelectionRange(newCursor, newCursor);
                }
            }, 0);
            setListening(false);
        };
        rec.onerror = (e: any) => {
            clearTimeout(timeout);
            setListening(false);
            if (e.error === 'not-allowed') setError('Microphone access denied');
            else if (e.error === 'audio-capture') setError('Microphone not available');
            else if (e.error === 'network') setError('Speech service network error');
            else setError('Speech recognition error');
        };
        rec.onend = () => {
            clearTimeout(timeout);
            setListening(false);
        };
        try {
            rec.start();
        } catch {
            setError('Failed to start mic');
            setListening(false);
        }
    };
    const openMenu = (el: HTMLElement) => setAnchorEl(el);
    const closeMenu = () => setAnchorEl(null);
    if (!supported) return null;
    return (
        <Box display="flex" alignItems="center" gap={1}>
            <Tooltip
                title={
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
                        <Typography variant="subtitle2">Language: {lang === 'he-IL' ? 'Hebrew' : 'English'}</Typography>
                        <Typography variant="caption">Right‑click / Shift: change language</Typography>
                    </Box>
                }
                placement="top"
                arrow
                componentsProps={{
                    tooltip: {
                        sx: {
                            bgcolor: 'grey.900',
                            color: 'common.white',
                            px: 1.5,
                            py: 1,
                            borderRadius: 2,
                            maxWidth: 240,
                            whiteSpace: 'normal',
                            overflowWrap: 'break-word'
                        }
                    }
                }}
            >
                <span>
                    <IconButton
                        size="small"
                        onClick={(e) => {
                            const me = e as React.MouseEvent<HTMLButtonElement>;
                            if (me.shiftKey) openMenu(me.currentTarget);
                            else startListening();
                        }}
                        onContextMenu={(e) => {
                            e.preventDefault();
                            openMenu(e.currentTarget);
                        }}
                        disabled={listening}
                    >
                        {listening ? <CircularProgress size={20} /> : <MicIcon fontSize="small" />}
                    </IconButton>
                </span>
            </Tooltip>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
                <MenuItem selected={lang === 'he-IL'} onClick={() => { setLang('he-IL'); closeMenu(); }}>
                    עברית (HE)
                </MenuItem>
                <MenuItem selected={lang === 'en-US'} onClick={() => { setLang('en-US'); closeMenu(); }}>
                    English (EN)
                </MenuItem>
            </Menu>
            {listening && <Typography variant="caption">{lang === 'he-IL' ? 'מאזין…' : 'Listening…'}</Typography>}
            {error && (
                <Paper elevation={3} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 1, bgcolor: 'error.main', color: 'white' }}>
                    <MicOffIcon fontSize="small" />
                    <Typography variant="caption">{error}</Typography>
                </Paper>
            )}
        </Box>
    );
};

const PopupMessage = ({ message, color }: { message: string; color: 'error' | 'success' }) => (
    <Box className={`popup-message ${color}`}>
        <Typography variant="body1">{message}</Typography>
    </Box>
);

export default function UnifiedEntry() {
    const [, setPickupFloor] = useState<number | null>(null);
    const [, setPickupElevator] = useState<number | null>(null);
    const handleVehicleSelect = (plate: string) => {
        setSelectedVehicle(plate);
        setLicensePlate(plate);
        setOpenModal(false);
        handleSearch('plate', plate);
    };
    const showPopup = (message: string, color: 'error' | 'success') => setPopup({ message, color });

    const resetSearch = () => {
        setEmployeeVehicles([]);
        setSelectedVehicle('');
        setQueues([]);
        setUserVehicle('');
    };
    const [searchMode, setSearchMode] = useState<'plate' | 'employee'>('plate');
    const navigate = useNavigate();
    const [employeeId, setEmployeeId] = useState('');
    const [licensePlate, setLicensePlate] = useState('');
    const licensePlateRef = useRef<HTMLInputElement | null>(null);

    const formatLicensePlateInput = (val: string) => {
        const d = val.replace(/[^\d]/g, '');
        return d.length === 7 ? d.replace(/^(\d{2})(\d{3})(\d{2})$/, '$1-$2-$3') :
            d.length === 8 ? d.replace(/^(\d{3})(\d{2})(\d{3})$/, '$1-$2-$3') : d;
    };
    const [employeeVehicles, setEmployeeVehicles] = useState<{ licensePlate: string }[]>([]);
    const [, setSelectedVehicle] = useState('');
    const [, setQueues] = useState<any[]>([]);
    const [, setUserVehicle] = useState('');
    const [popup, setPopup] = useState<{ message: string; color: 'error' | 'success' } | null>(null);
    const [loading, setLoading] = useState(false);
    const [showQueuesLoading, setShowQueuesLoading] = useState(false);
    useEffect(() => {
        if (popup) {
            const timer = setTimeout(() => setPopup(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [popup]);

    const [openModal, setOpenModal] = useState(false);

    const handleSearch = async (type: 'plate' | 'employee', value: string) => {
        resetSearch();
        if (!value) return showPopup(`Please enter a ${type === 'plate' ? 'license plate' : 'employee ID'}`, 'error');
        setLoading(true);
        if (type === 'plate') {
            const digits = value.replace(/[^\d]/g, '');
            if (!(digits.length === 7 || digits.length === 8)) {
                setLoading(false);
                return showPopup('License plate must be 7 or 8 digits', 'error');
            }
            const floorNumber = String(localStorage.getItem('floorNumber'));
            const response = await sendVehicleData({ licensePlate: "ABC789", floor: floorNumber });
            console.log("API response:", response);

            setLoading(false);
            if (response.status !== 201) {
                showPopup(response.message || 'Vehicle not found in the system', 'error');
            } else {
                const [floor, elevator] = response.assigned_pickup_spot.split(':');
                setPickupFloor(Number(floor));
                setPickupElevator(Number(elevator));
                setUserVehicle(response.licensePlate);
                showPopup(
                    `Vehicle ${response.licensePlate} is at position ${response.position} in the queue. Floor ${floor}, Elevator ${elevator}.`,
                    'success'
                );
            }
        } else if (type === 'employee') {
            const digits = value.replace(/[^-\d]/g, '');
            if (digits.length !== 9) {
                setLoading(false);
                return showPopup('Employee ID must be exactly 9 digits', 'error');
            }
            const vehicles = await sendEmployeeVehicles(value);
            setLoading(false);
            // if (!vehicles.length) {
            //     return showPopup('No vehicles found for this employee.', 'error');
            // }
            setEmployeeVehicles(vehicles);
            setOpenModal(true);
        }
    }

    return (
        <div style={{
            height: '100vh',
            width: '100vw',
            position: 'relative',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            background: 'linear-gradient(120deg, #e3f0ff 0%, #f8faff 100%)',
            paddingTop: 0,
            overflow: 'hidden',
        }}>
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-start',
                gap: 16,
                width: '100%',
                maxWidth: 420,
                marginTop: 80,
            }}>
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 700, color: '#1976d2', letterSpacing: 1, textAlign: 'center' }}>Vehicle Queue Entry</Typography>
                <ToggleButtonGroup
                    value={searchMode}
                    exclusive
                    onChange={(_, val) => { if (val) setSearchMode(val); }}
                    className="custom-toggle-group"
                    sx={{
                        mb: 2,
                        bgcolor: 'rgba(245,250,255,0.95)',
                        borderRadius: 3,
                        boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                        alignSelf: 'center',
                        maxWidth: 300,
                        width: 300,
                        height: 48,
                        border: '1.5px solid #e0e7ef',
                        overflow: 'hidden',
                    }}
                >
                    <ToggleButton value="plate" className="custom-toggle-btn">By License Plate</ToggleButton>
                    <ToggleButton value="employee" className="custom-toggle-btn">By Employee ID</ToggleButton>
                </ToggleButtonGroup>
                <form
                    onSubmit={e => {
                        e.preventDefault();
                        if (searchMode === 'plate' && licensePlate) handleSearch('plate', licensePlate);
                        else if (searchMode === 'employee' && employeeId) handleSearch('employee', employeeId);
                    }}
                    style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 20, alignItems: 'center' }}
                >
                    {searchMode === 'plate' && (
                            <TextField
                                label="License Plate"
                                variant="outlined"
                                value={licensePlate}
                                onChange={e => setLicensePlate(formatLicensePlateInput(e.target.value))}
                                inputRef={licensePlateRef}
                                sx={{ maxWidth: 300, width: 300, backgroundColor: 'white', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}
                                InputProps={{
                                    endAdornment: (
                                        <VoiceInput
                                            inputRef={licensePlateRef}
                                            onChange={val => setLicensePlate(val)}
                                            currentValue={licensePlate}
                                        />
                                    )
                                }}
                            />
                    )}
                    {searchMode === 'employee' && (
                        <TextField
                            label="Employee ID"
                            variant="outlined"
                            value={employeeId}
                            onChange={e => setEmployeeId(e.target.value)}
                            sx={{ maxWidth: 300, width: 300, backgroundColor: 'white', borderRadius: 2, boxShadow: 1, textAlign: 'center' }}
                        />
                    )}
                    <Button
                        type="submit"
                        variant="contained"
                        sx={{ maxWidth: 300, width: 300, fontWeight: 600, fontSize: 15, borderRadius: 2, boxShadow: 2, py: 0.7, alignSelf: 'center' }}
                        startIcon={<SearchIcon />}
                        disabled={loading}
                    >
                        Search
                    </Button>
                    {loading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}><CircularProgress /></Box>}
                </form>

                <div style={{
                    position: 'absolute',
                    left: 24,
                    bottom: 32,
                    zIndex: 10,
                }}>
                    <Button
                        variant="contained"
                        className="show-queues-btn"
                        sx={{ width: 220, fontWeight: 600, fontSize: 17, borderRadius: 2, boxShadow: 2, py: 1.2, bgcolor: '#1976d2' }}
                        onClick={async () => {
                            setShowQueuesLoading(true);
                            const floorNumber = Number(localStorage.getItem('floorNumber'));
                            const response = await sendFloorQueues(floorNumber);
                            setShowQueuesLoading(false);
                            navigate('/VehicleQueue', { state: { queues: response, floorNumber } });
                        }}
                    >
                        Show Queues
                    </Button>
                    <Dialog open={showQueuesLoading}>
                        <DialogTitle sx={{ textAlign: 'center', fontWeight: 700 }}>Loading queues...</DialogTitle>
                        <DialogContent sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minWidth: 200, minHeight: 80 }}>
                            <CircularProgress />
                        </DialogContent>
                    </Dialog>
                </div>

                <Dialog open={openModal} onClose={() => setOpenModal(false)}>
                    <DialogTitle sx={{ fontWeight: 700, color: '#1976d2', textAlign: 'center' }}>Select Vehicle</DialogTitle>
                    <DialogContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {/* {employeeVehicles.length === 0 ? (
                            <Typography>No vehicles found for this employee.</Typography>
                        ) : (
                            employeeVehicles.map((v, idx) => (
                                <Button
                                    key={v.licensePlate}
                                    sx={{ my: 1, width: 220, fontWeight: 600, borderRadius: 2, alignSelf: 'center' }}
                                    variant="outlined"
                                    onClick={() => handleVehicleSelect(v.licensePlate)}
                                >
                                    {v.licensePlate}
                                </Button>
                            ))
                        )} */}
                    </DialogContent>
                    <DialogActions sx={{ justifyContent: 'center' }}>
                        <Button onClick={() => setOpenModal(false)} sx={{ fontWeight: 600 }}>Close</Button>
                    </DialogActions>
                </Dialog>

                {popup && <PopupMessage message={popup.message} color={popup.color} />}
            </div>
        </div>
    );
}