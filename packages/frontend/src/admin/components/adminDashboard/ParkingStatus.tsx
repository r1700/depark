import React, { useEffect, useRef, useState } from 'react';
import { RootState, useAppDispatch, useAppSelector } from '../../app/store';
import { fetchCount, setDate, setCount, setError } from './parkingStatusSlice';
import { Box, Container, Typography, CircularProgress, Paper } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { enGB } from 'date-fns/locale';
import { isSameDay, isValid } from 'date-fns';
function ParkingOccupiedCount() {
    const dispatch = useAppDispatch();
    const wsRef = useRef<WebSocket | null>(null);
    const dateIso = useAppSelector((state: RootState) => state.parkingStatus.date);
    const count = useAppSelector((state: RootState) => state.parkingStatus.count);
    const loading = useAppSelector((state: RootState) => state.parkingStatus.loading);
    const pickerDate: Date | null = dateIso ? new Date(dateIso) : null;
    const [tempDate, setTempDate] = useState<Date | null>(pickerDate);
    // If error date
    const [dateError, setDateError] = useState<string | null>(null);
    // Max and Min time that can be Valid
    const minDate = new Date("2000-01-01T00:00:00");
    const maxDate = new Date(); // now
    const dateIsoRef = useRef<string | null>(dateIso);
    useEffect(() => {
        dateIsoRef.current = dateIso;
    }, [dateIso]);
    useEffect(() => {
        if (!dateIso) {
            const initialDate = new Date().toISOString();
            dispatch(setDate(initialDate));
            setTempDate(new Date(initialDate));
            dispatch(fetchCount(initialDate));
        } else
            dispatch(fetchCount(dateIso));
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const ws = new WebSocket(`${protocol}://localhost:3001`);
        wsRef.current = ws;
        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                if (data.event) {
                    const now = new Date()
                    console.log("dateIso", dateIso);
                    const selectedIso = dateIsoRef.current;
                    const selected = selectedIso ? new Date(selectedIso) : null;
                    // const selected = dateIso ? new Date(dateIso) : null;
                    console.log('selected', selected, 'now', now);
                    // update date to now when there is an update in DB
                    if (selected && isSameDay(selected, now)) {
                        console.log('selected', selected, 'now', now);
                        const nowIso = now.toISOString();
                        dispatch(setDate(nowIso));
                        dispatch(fetchCount(dateIso ? dateIso : nowIso));
                    }
                }
            } catch (err) {
                console.error("WS message parse error", err);
            }
        };
        ws.onerror = (err) => {
            console.error('WebSocket error', err);
            dispatch(setError('WebSocket connection error'));
        };
        ws.onclose = () => { }
        return () => {
            // if (wsRef.current) wsRef.current.close();
        };
    }, [dispatch]);
    useEffect(() => {
        setTempDate(dateIso ? new Date(dateIso) : null);
    }, [dateIso]);
    const handleSubmit = (e?: React.FormEvent, dateOverride?: Date | null) => {
        if (e) e.preventDefault();
        const effectiveDate = dateOverride ?? tempDate;
        if (!effectiveDate || !isValid(effectiveDate)) return;
        const t = effectiveDate.getTime();
        if (t < minDate.getTime() || t > maxDate.getTime()) return;
        const iso = effectiveDate.toISOString();
        dispatch(setDate(iso));
        dispatch(fetchCount(iso));
    };
    return (
        <Container maxWidth="md" >
            <Paper elevation={3}
                sx={{
                    bgcolor: "background.paper",
                    p: 6,
                    mt: 2,
                    borderRadius: 2,
                    maxWidth: 550,
                    minHeight: 280,
                    margin: "0 auto",
                }}>
                <Typography variant="h5" fontWeight={700} gutterBottom textAlign="center">
                    Parkings space occupied
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "1fr", gap: 4, alignItems: "start", mt: 4 }}>
                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
                            <DateTimePicker
                                value={tempDate ?? new Date()}
                                onChange={(newVal: Date | null) => {
                                    setTempDate(newVal);
                                }}
                                onAccept={(newVal) => {
                                    handleSubmit(undefined, newVal);
                                }}
                                // If error in picker(invalid, out of range etc.)
                                onError={(reason) => {
                                    if (reason) {
                                        setDateError("Please select a valid date");
                                    } else {
                                        setDateError(null);
                                    }
                                }}
                                minDateTime={minDate}
                                maxDateTime={maxDate}
                                slotProps={{
                                    textField: {
                                        fullWidth: true,
                                        size: 'small',
                                        error: !!dateError,
                                        helperText: dateError ?? undefined,
                                    },
                                    popper: {
                                        sx: {
                                            '& .MuiPaper-root': {
                                                minWidth: 300,
                                                minHeight: 360,
                                                background: '#fff',
                                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                                overflow: 'visible',
                                            },
                                            '& .MuiPickersLayout-root': { transform: 'scale(1)', transformOrigin: 'top center' },
                                        },
                                    },
                                }}
                            />
                        </LocalizationProvider>
                    </Box>
                    <Box sx={{ textAlign: "center", bgcolor: "primary.light", borderRadius: 3, p: 3, color: "primary.contrastText", boxShadow: "inset 0 0 10px rgba(0,0,0,0.1)" }}>
                        {dateError ? (
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                                Please select a valid date
                            </Typography>
                        ) : (loading && count === null) ? (
                            <CircularProgress color="inherit" size={60} />
                        ) : (
                            <Typography variant="h2" fontWeight={700}>
                                {count !== null ? count : "-"}
                            </Typography>
                        )}
                        <Typography variant="subtitle2">Spaces</Typography>
                    </Box>
                </Box>
            </Paper>
        </Container>
    );
}
export default ParkingOccupiedCount;