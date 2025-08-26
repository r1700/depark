import React, { useEffect, useRef, useState } from 'react';
import VehicleQueue from '../VehicleQueue/VehicleQueue';
import { sampleVehicles, employeeVehiclesMap } from '../../data';
import {
  Autocomplete,
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MicIcon from '@mui/icons-material/Mic';
import MicOffIcon from '@mui/icons-material/MicOff';
import WifiOffIcon from '@mui/icons-material/WifiOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';
import './UnifiedEntry.css';

const MIN_DIGITS = 4;
const MAX_PLATE_DIGITS = 8;

const DIGITS_HE: Record<string, string> = {
  'אפס':'0','אחד':'1','אחת':'1','שתיים':'2','שניים':'2','שתים':'2','שתי':'2',
  'שלוש':'3','שלושה':'3','ארבע':'4','ארבעה':'4','חמש':'5','חמישה':'5',
  'שש':'6','שישה':'6','שבע':'7','שבעה':'7','שמונה':'8','תשע':'9','תשעה':'9',
};
const DIGITS_EN: Record<string, string> = {
  zero:'0', one:'1', two:'2', three:'3', four:'4', five:'5', six:'6', seven:'7', eight:'8', nine:'9',
  oh:'0', o:'0', to:'2', too:'2', for:'4', ate:'8',
};
const STOPWORDS_EN = new Set(['and','dash','hyphen','space','plate','number','license','car','my','is','the']);

function digitsOnlyAnyLang(raw: string) {
  const tokens = raw
    .toLowerCase()
    .replace(/[\-_/\\.,;:|'"?!()[\]{}]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter(t => !STOPWORDS_EN.has(t));

  const out: string[] = [];
  for (const t of tokens) {
    if (DIGITS_HE[t]) { out.push(DIGITS_HE[t]); continue; }
    if (DIGITS_EN[t]) { out.push(DIGITS_EN[t]); continue; }
    const digits = t.replace(/[^0-9]/g, '');
    if (digits) out.push(digits);
  }
  return out.join('').slice(0, MAX_PLATE_DIGITS);
}

function formatIsraeliPlate(plate: string) {
  const digits = plate.replace(/[^0-9]/g, '');
  if (digits.length === 7)
    return `${digits.slice(0,2)}-${digits.slice(2,5)}-${digits.slice(5,7)}`;
  if (digits.length === 8)
    return `${digits.slice(0,3)}-${digits.slice(3,5)}-${digits.slice(5,8)}`;
  return digits;
}

type Lang = 'he-IL' | 'en-US';
const tListening = (lang: Lang) => (lang === 'he-IL' ? 'מאזין…' : 'listening…');

const ERR_EN = {
  noSpeech: 'No speech detected',
  noPlate: 'Could not recognize plate, please try again or type manually',
  noDigits: 'Speech did not contain digits',
  netErr: 'Speech service network error',
  micDenied: 'Microphone permission denied',
  micNA: 'Microphone not available',
  cannotStart: 'Cannot start microphone',
  notFound: 'Vehicle not found in the system',
  emptyPlate: 'Please enter a license plate',
  emptyEmployee: 'Please enter a 5-digit employee ID',
  noVehicles: 'No vehicles found for this employee',
};
const err = (k: keyof typeof ERR_EN) => ERR_EN[k];

type PopupColor = 'error' | 'success' | 'warning' | 'info';
type PopupIcon  = 'mic' | 'net' | 'error' | 'ok' | 'info';
type PopupPayload = { message: string; color: PopupColor; icon?: PopupIcon };

const makePopup = (message: string, color: PopupColor, icon?: PopupIcon): PopupPayload =>
  ({ message, color, icon });

const PopupMessage = ({ message, color, icon = 'info' }: PopupPayload) => {
  const IconEl =
    icon === 'mic'   ? MicOffIcon :
    icon === 'net'   ? WifiOffIcon :
    icon === 'ok'    ? CheckCircleIcon :
    icon === 'error' ? ErrorOutlineIcon :
    InfoIcon;

  return (
    <Paper
      elevation={6}
      sx={{
        position: 'fixed',
        bottom: 20,
        right: 20,
        zIndex: 1300,
        px: 2,
        py: 1.25,
        borderRadius: 3,
        boxShadow: '0 8px 32px rgba(0,0,0,0.35)',
        bgcolor: (theme) =>
          color === 'error'   ? theme.palette.error.main   :
          color === 'success' ? theme.palette.success.main :
          color === 'warning' ? theme.palette.warning.main :
                                 theme.palette.info.main,
        color: 'common.white',
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        maxWidth: 560,
      }}
    >
      <IconEl fontSize="small" />
      <Typography variant="body2" sx={{ lineHeight: 1.4 }}>{message}</Typography>
    </Paper>
  );
};

function VoiceButtonWithLang({
  lang, setLang, onStart, disabled, supported,
}: {
  lang: Lang;
  setLang: (l: Lang) => void;
  onStart: () => void;
  disabled?: boolean;
  supported: boolean;
}) {
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const openMenu = (el: HTMLElement) => setAnchorEl(el);
  const closeMenu = () => setAnchorEl(null);

  const titleNode = (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25 }}>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
        Language: {lang === 'he-IL' ? 'Hebrew' : 'English'}
      </Typography>
      <Typography variant="caption">Right‑click / Shift: change language</Typography>
    </Box>
  );

  return (
    <>
      <Tooltip
        title={titleNode}
        placement="bottom"
        arrow
        enterDelay={250}
        leaveDelay={80}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'grey.900',
              color: 'common.white',
              boxShadow: 3,
              borderRadius: 2,
              p: 1,
              maxWidth: 280,
            },
          },
          arrow: { sx: { color: 'grey.900' } },
        }}
      >
        <span>
          <IconButton
            size="small"
            aria-haspopup="menu"
            aria-expanded={Boolean(anchorEl)}
            disabled={!supported || !!disabled}
            onClick={(e) => {
              if ((e as any).shiftKey) openMenu(e.currentTarget);
              else onStart();
            }}
            onContextMenu={(e) => { e.preventDefault(); openMenu(e.currentTarget); }}
          >
            <MicIcon fontSize="small" />
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
    </>
  );
}

const UnifiedEntry: React.FC = () => {
  const [employeeId, setEmployeeId] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [employeeVehicles, setEmployeeVehicles] = useState<{ licensePlate: string }[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [queue, setQueue] = useState<any[]>([]);
  const [userVehicle, setUserVehicle] = useState<string>('');
  const [popup, setPopup] = useState<PopupPayload | null>(null);

  const [lang, setLang] = useState<Lang>('he-IL');
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState<boolean>(false);

  const [cursorPos, setCursorPos] = useState<number>(0);

  const srCtorRef = useRef<any>(null);
  const recRef = useRef<any>(null);
  const silenceTimeoutRef = useRef<number | null>(null);
  const resultTimeoutRef = useRef<number | null>(null);
  const gotSpeechRef = useRef(false);
  const gotResultRef = useRef(false);

  const clearTimers = () => {
    if (silenceTimeoutRef.current) { window.clearTimeout(silenceTimeoutRef.current); silenceTimeoutRef.current = null; }
    if (resultTimeoutRef.current) { window.clearTimeout(resultTimeoutRef.current); resultTimeoutRef.current = null; }
  };

  useEffect(() => {
    const w = window as any;
    srCtorRef.current = w.SpeechRecognition || w.webkitSpeechRecognition || null;
    setSupported(Boolean(srCtorRef.current));
    return () => {
      try { recRef.current?.stop(); } catch {}
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!popup) return;
    const ms = popup.color === 'error' ? 4500 : 2800;
    const t = setTimeout(() => setPopup(null), ms);
    return () => clearTimeout(t);
  }, [popup]);

  // Voice input: add digits exactly at cursor position (start, middle, end)
  const handleVoicePlate = () => {
    const SR = srCtorRef.current;
    if (!SR) {
      setPopup(makePopup(err('micNA'), 'error', 'mic'));
      return;
    }
    if (navigator.onLine === false) {
      setPopup(makePopup(err('netErr'), 'error', 'net'));
      return;
    }
    if (recRef.current) { try { recRef.current.stop(); } catch {} recRef.current = null; }

    const rec: any = new SR();
    rec.lang = lang;
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    rec.continuous = false;

    rec.onstart = () => {
      gotSpeechRef.current = false;
      gotResultRef.current = false;
      setListening(true);
      clearTimers();
      silenceTimeoutRef.current = window.setTimeout(() => {
        try { rec.stop(); } catch {}
        setPopup(makePopup(err('noSpeech'), 'error', 'mic'));
      }, 5000);
    };

    rec.onspeechstart = () => {
      gotSpeechRef.current = true;
      if (silenceTimeoutRef.current) { window.clearTimeout(silenceTimeoutRef.current); silenceTimeoutRef.current = null; }
      resultTimeoutRef.current = window.setTimeout(() => {
        try { rec.stop(); } catch {}
        if (!gotResultRef.current) setPopup(makePopup(err('noPlate'), 'error', 'error'));
      }, 5000);
    };

    rec.onresult = (e: any) => {
      gotResultRef.current = true;
      clearTimers();
      const alt = e.results?.[0]?.[0];
      const transcript: string = alt?.transcript ?? '';
      const confidence: number = typeof alt?.confidence === 'number' ? alt.confidence : 1;

      const minConf = lang === 'en-US' ? 0.2 : 0.6;
      if (!transcript.trim() || confidence < minConf) {
        setPopup(makePopup(err('noPlate'), 'error', 'error'));
        return;
      }

      const digitsOnly = digitsOnlyAnyLang(transcript);
      if (!digitsOnly) {
        setPopup(makePopup(err('noDigits'), 'error', 'error'));
        return;
      }

      const currentDigits = licensePlate.replace(/[^0-9]/g, '');

      // Find cursor position in digits only
      let pos = cursorPos;
      const input = document.querySelector('input.input-field') as HTMLInputElement;
      if (input) {
        const rawPos = input.selectionStart ?? 0;
        let digitPos = 0;
        for (let i = 0; i < rawPos && i < licensePlate.length; i++) {
          if (/\d/.test(licensePlate[i])) digitPos++;
        }
        pos = digitPos;
      }

      // If field is empty, insert all digits
      if (!currentDigits) {
        const newDigits = digitsOnly.slice(0, MAX_PLATE_DIGITS);
        const formatted = formatIsraeliPlate(newDigits);
        setLicensePlate(formatted);
        setTimeout(() => {
          const input = document.querySelector('input.input-field') as HTMLInputElement;
          if (input) {
            input.setSelectionRange(formatted.length, formatted.length);
            setCursorPos(newDigits.length);
          }
        }, 0);
        return;
      }

      // If already 8 digits, do not add
      if (currentDigits.length >= MAX_PLATE_DIGITS) {
        setPopup(makePopup('Cannot add more digits', 'error', 'error'));
        return;
      }

      // Add at cursor position in digits only
      let toAdd = digitsOnly.slice(0, MAX_PLATE_DIGITS - currentDigits.length);
      let newDigits: string;
      if (pos <= 0) {
        // Cursor at start - add at start
        newDigits = toAdd + currentDigits;
      } else if (pos >= currentDigits.length) {
        // Cursor at end - add at end
        newDigits = currentDigits + toAdd;
      } else {
        // Cursor in middle - add in middle
        newDigits = currentDigits.slice(0, pos) + toAdd + currentDigits.slice(pos);
      }
      newDigits = newDigits.slice(0, MAX_PLATE_DIGITS);

      // Update format
      const formatted = formatIsraeliPlate(newDigits);

      // Calculate new cursor position in formatted string (with dashes)
      let digitsBefore: number;
      if (pos <= 0) digitsBefore = toAdd.length;
      else if (pos >= currentDigits.length) digitsBefore = newDigits.length;
      else digitsBefore = pos + toAdd.length;

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

      setLicensePlate(formatted);
      setTimeout(() => {
        const input = document.querySelector('input.input-field') as HTMLInputElement;
        if (input) {
          input.setSelectionRange(newCursor, newCursor);
          setCursorPos(digitsBefore);
        }
      }, 0);
    };

    rec.onspeechend = () => { try { rec.stop(); } catch {} };

    rec.onerror = (e: any) => {
      clearTimers();
      const m: PopupPayload =
        e?.error === 'no-speech'
          ? makePopup(err('noSpeech'), 'error', 'mic')
          : e?.error === 'audio-capture'
          ? makePopup(err('micNA'), 'error', 'mic')
          : e?.error === 'not-allowed'
          ? makePopup(err('micDenied'), 'error', 'mic')
          : e?.error === 'network'
          ? makePopup(err('netErr'), 'error', 'net')
          : makePopup(`Error: ${e?.error || 'unknown'}`, 'error', 'error');

      setPopup(m);
      setListening(false);
    };

    rec.onend = () => {
      setListening(false);
      clearTimers();
      if (!gotSpeechRef.current && !gotResultRef.current) {
        setPopup(p => p ?? makePopup(err('noSpeech'), 'error', 'mic'));
      }
    };

    recRef.current = rec;
    try {
      rec.start();
    } catch {
      setPopup(makePopup(err('cannotStart'), 'error', 'mic'));
    }
  };

  const handleSearch = () => {
    const lp = licensePlate.replace(/[^0-9]/g, '').trim();
    if (!lp) {
      setPopup(makePopup(err('emptyPlate'), 'error', 'info'));
      setEmployeeVehicles([]); setSelectedVehicle(''); setQueue([]); setUserVehicle('');
      return;
    }
    const foundVehicle = sampleVehicles.find((v) => v.licensePlate === lp);
    setEmployeeVehicles([]); setSelectedVehicle(''); setUserVehicle(lp); setQueue(sampleVehicles);
    if (!foundVehicle) {
      setPopup(makePopup(err('notFound'), 'error', 'error'));
      return;
    }
    const idx = sampleVehicles.findIndex((v: { licensePlate: string }) => v.licensePlate === lp);
    setPopup(makePopup(`Vehicle is in the queue at position ${idx + 1}`, 'success', 'ok'));
  };

  const employeeIds = Object.keys(employeeVehiclesMap);
  const licensePlates = sampleVehicles.map((v) => v.licensePlate);

  return (
    <div className="license-plate-input-unified">
      <div className="search-bar-wrapper">
        <form
          onSubmit={(e) => { e.preventDefault(); handleSearch(); }}
          style={{ width:'100%', display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom:'1.5rem' }}
        >
          <Stack direction="row" spacing={1} alignItems="center">
            {listening && (
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {tListening(lang)}
              </Typography>
            )}
          </Stack>

          <Autocomplete
            freeSolo
            options={licensePlates}
            inputValue={licensePlate}
            onInputChange={(_, value) => {
              const digits = value.replace(/[^0-9]/g, '').slice(0, MAX_PLATE_DIGITS);
              setLicensePlate(formatIsraeliPlate(digits));
              if (!digits.trim()) {
                setEmployeeVehicles([]); setSelectedVehicle(''); setQueue([]); setUserVehicle('');
              }
            }}
            open={!!licensePlate}
            openOnFocus={false}
            filterOptions={(options, { inputValue }) =>
              inputValue ? options.filter(option => option.includes(inputValue.replace(/[^0-9]/g, ''))) : []
            }
            renderInput={(params) => (
              <TextField
                {...params}
                className="input-field"
                label="Enter license plate"
                variant="outlined"
                value={licensePlate}
                inputProps={{
                  ...params.inputProps,
                  onSelect: (e: React.SyntheticEvent<HTMLInputElement>) => {
                    const target = e.target as HTMLInputElement;
                    setCursorPos(target.selectionStart ?? 0);
                  }
                }}
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <Box sx={{
                        display:'flex', alignItems:'center', gap:0.5,
                        '& .MuiIconButton-root': { p:0.5, borderRadius:1.25, transition:'background 120ms ease, transform 40ms ease' },
                        '& .MuiIconButton-root:hover': { backgroundColor:'action.hover' },
                        '& .MuiIconButton-root:active': { transform:'scale(0.98)' },
                      }}>
                        <VoiceButtonWithLang
                          lang={lang}
                          setLang={setLang}
                          onStart={handleVoicePlate}
                          disabled={listening || licensePlate.replace(/[^0-9]/g, '').length >= MAX_PLATE_DIGITS}
                          supported={supported}
                        />
                        <IconButton
                          size="small"
                          aria-label="search license plate"
                          title="Search"
                          onClick={handleSearch}
                          disabled={!licensePlate.trim()}
                        >
                          <SearchIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </InputAdornment>
                  ),
                  endAdornment: params.InputProps.endAdornment,
                }}
              />
            )}
          />
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!/^\d{5}$/.test(employeeId)) {
              setPopup(makePopup(err('emptyEmployee'), 'error', 'info'));
              setEmployeeVehicles([]); setSelectedVehicle(''); setQueue([]); setUserVehicle('');
              return;
            }
            if (!employeeVehiclesMap[employeeId]) {
              setEmployeeVehicles([]); setSelectedVehicle(''); setQueue([]); setUserVehicle('');
              setPopup(makePopup(err('noVehicles'), 'error', 'error'));
              return;
            }
            setEmployeeVehicles(employeeVehiclesMap[employeeId]);
            setSelectedVehicle(''); setQueue([]); setUserVehicle(''); setPopup(null);
          }}
          style={{ width:'100%', display:'flex', flexDirection:'row', alignItems:'center', gap:'0.5rem' }}
        >
          <Autocomplete
            freeSolo
            options={employeeIds}
            inputValue={employeeId}
            onInputChange={(_, value) => {
              setEmployeeId(value);
              if (value) { setQueue([]); setUserVehicle(''); }
            }}
            filterOptions={(options, { inputValue }) =>
              inputValue ? options.filter(option => option.includes(inputValue)) : []
            }
            renderInput={(params) => (
              <TextField
                {...params}
                className="input-field"
                label="Enter employee ID"
                variant="outlined"
                InputProps={{
                  ...params.InputProps,
                  startAdornment: (
                    <InputAdornment position="start">
                      <IconButton
                        size="small"
                        aria-label="search employee"
                        title="Search"
                        onClick={() => {
                          if (employeeId) {
                            if (!employeeVehiclesMap[employeeId]) {
                              setEmployeeVehicles([]); setPopup(makePopup(err('noVehicles'), 'error', 'error'));
                              return;
                            }
                            setEmployeeVehicles(employeeVehiclesMap[employeeId]);
                            setPopup(null);
                          } else {
                            setPopup(makePopup(err('emptyEmployee'), 'error', 'info'));
                          }
                        }}
                      >
                        <SearchIcon fontSize="small" />
                      </IconButton>
                    </InputAdornment>
                  ),
                  endAdornment: params.InputProps.endAdornment,
                }}
              />
            )}
          />
        </form>

        {employeeVehicles.length > 0 && (
          <FormControl
            sx={{ mt: 2, minWidth: 180, width: '100%', maxWidth: 260, ml: 'auto', mr: 'auto', display: 'block' }}
            className="rounded-select-form"
          >
            <InputLabel id="vehicle-select-label">Select vehicle</InputLabel>
            <Select
              labelId="vehicle-select-label"
              value={selectedVehicle}
              label="Select vehicle"
              onChange={(e: SelectChangeEvent<string>) => {
                const lp = e.target.value;
                setSelectedVehicle(lp);
                setUserVehicle(lp);
                setQueue(sampleVehicles);
                const foundVehicle = sampleVehicles.find((v) => v.licensePlate === lp);
                if (!foundVehicle) {
                  setPopup(makePopup(err('notFound'), 'error', 'error'));
                  return;
                }
                const idx = sampleVehicles.findIndex((v: { licensePlate: string }) => v.licensePlate === lp);
                setPopup(makePopup(`The vehicle is in the queue at position ${idx + 1}`, 'success', 'ok'));
              }}
              aria-label="Select vehicle"
              className="rounded-select"
              MenuProps={{ PaperProps: { className: 'rounded-select-dropdown', style: { borderRadius: '1.2rem', minWidth: 180, maxWidth: 260, width: 260 } } }}
            >
              {employeeVehicles.map((v) => (
                <MenuItem key={v.licensePlate} value={v.licensePlate}>
                  {formatIsraeliPlate(v.licensePlate)}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </div>

      <div className="queue-section">
        {userVehicle && queue.length > 0 && !(popup && popup.color === 'error') && (
          <VehicleQueue vehicles={queue} userVehicle={userVehicle} />
        )}
      </div>

      {popup && <PopupMessage message={popup.message} color={popup.color} icon={popup.icon} />}
    </div>
  );
};

export default UnifiedEntry;