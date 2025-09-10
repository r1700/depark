import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Box,
    TextField,
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
import MenuItem from '@mui/material/MenuItem';
import { Info as InfoIcon } from '@mui/icons-material';
import { useAppDispatch } from '../app/store';
import { fetchUsers } from '../app/pages/user/userThunks';
import { statusToNumber, numberToStatus } from "../../utils/statusMapper";
import { useLocation } from "react-router-dom";


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
const getInitialToken = () => {
    return localStorage.getItem("token") || "";
};
const getInitialUserId = () => {   
    return  localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user") || "{}").id : 'U1000';
};
   const getInitialrole = () => {
    if (localStorage.getItem("user")) {
        const role = JSON.parse(localStorage.getItem("user") || "{}").role;
        if (role === 1) return "admin";
        if (role === 2) return "HR";
    }
    return "user";
};


const initialForm = {
    baseuser_id: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    department: '',
    employee_id: getInitialUserId(),
    google_id: getInitialToken(),
    status: '',
    max_cars_allowed_parking: '',
    created_by: getInitialrole(),
    approved_by: '',
};

export default function UsersConfigPage() {
    const location = useLocation();
    const dispatch = useAppDispatch();
    const [emailError, setEmailError] = useState<string | null>(null);
    const [phoneError, setPhoneError] = useState<string | null>(null);


    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone: string) => {
        return /^\d+$/.test(phone);
    };

    useEffect(() => {
        if (location.state) {
            handleEdit(location.state);
        }
    }, [location.state]);

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const [editId, setEditId] = useState<string | null>(null);
    const [form, setForm] = useState<typeof initialForm>(initialForm);

    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [saving, setSaving] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);

    
    const handleEdit = (user: any) => {
        setEditId(user.id); 
        setForm({
            baseuser_id: user.baseuser_id ?? '',
            firstName: user.first_name ?? '',
            lastName: user.last_name ?? '',
            email: user.email ?? '',
            phone: user.phone ?? '',
            department: user.department ?? '',
            employee_id: user.employee_id ?? '',
            google_id: user.google_id ?? '',
            status: user.status !== null && user.status !== undefined ? numberToStatus(user.status) : '',
            max_cars_allowed_parking: user.max_cars_allowed_parking !== null && user.max_cars_allowed_parking !== undefined ? String(user.max_cars_allowed_parking) : '',
            created_by: user.created_by ?? '',
            approved_by: user.approved_by ?? '',
        });
    };
  

    const handleSave = async () => {
        if (!validateEmail(form.email)) {
            setEmailError("Invalid email address");
            return;
        } else {
            setEmailError(null);
        }
     
        if (form.phone && !validatePhone(form.phone)) {
            setPhoneError("Phone must contain only digits");
            return;
        } else {
            setPhoneError(null);
        }


        setSaving(true);
        try {
          
            const today = new Date().toISOString();

            const approved_by = form.status === "approved" ? getInitialrole() : "";

            const formToSave = {
                first_name: form.firstName,
                last_name: form.lastName,
                email: form.email,
                phone: form.phone,
                status: statusToNumber(form.status),
                department: form.department,
                employee_id: getInitialUserId(),
                google_id: getInitialToken(),
                max_cars_allowed_parking: Number(form.max_cars_allowed_parking),
                created_by: getInitialrole(),
                approved_by:approved_by,
                approved_at: today
            };

            console.log(formToSave);

            let response;
            if (editId) {
                response = await fetch('/api/users/update', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: editId, ...formToSave })
                });
            }
            else {
                response = await fetch('/api/users/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(formToSave)
                });
            }

            if (!response.ok) {
                throw new Error('Server error');
            }

            setMessage({ type: 'success', text: editId ? 'User updated!' : 'User added!' });
            setEditId(null);
            setForm({
                ...initialForm,
                employee_id: getInitialUserId(),
                created_by: getInitialrole(),
                google_id: getInitialToken()
            });
            dispatch(fetchUsers());
        } catch {
            setMessage({ type: 'error', text: 'Failed to save user!' });
        }
        setSaving(false);
    };

    const handleResetClick = () => setShowResetConfirm(true);
    const confirmReset = () => {
        setShowResetConfirm(false);
        setForm({
            ...initialForm,
            employee_id: getInitialUserId(),
            created_by: getInitialrole(),
            google_id: getInitialToken()
        });
        setEditId(null);
        setMessage({ type: 'success', text: 'Form reset!' });
    };
    const cancelReset = () => setShowResetConfirm(false);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(null), 2000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    return (
        <ThemeProvider theme={theme}>
            <Container maxWidth="xl" sx={{ py: 4 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
                    <Box textAlign="center" mb={4}>
                        <Typography variant="h3" component="h1" gutterBottom sx={{
                            fontWeight: 400,
                            color: 'primary.main',
                            borderBottom: '2px solid',
                            borderColor: 'primary.main',
                            pb: 2,
                            mb: 4
                        }}>
                            Users Management
                        </Typography>
                    </Box>
                    <Box sx={{ width: '100%', mb: 4 }}>
                        <StyledCard>
                            <CardHeader
                                avatar={<Avatar sx={{ bgcolor: 'primary.main' }}><InfoIcon /></Avatar>}
                                title={<Typography variant="h6">{editId ? 'Edit User' : 'Add User'}</Typography>}
                            />
                            <CardContent>
                                <Stack spacing={2}>
                                    <TextField
                                        label="First Name"
                                        value={form.firstName}
                                        onChange={e => setForm(prev => ({ ...prev, firstName: e.target.value }))}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Last Name"
                                        value={form.lastName}
                                        onChange={e => setForm(prev => ({ ...prev, lastName: e.target.value }))}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Email"
                                        type="email"
                                        value={form.email}
                                        onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                                        error={!!emailError}
                                        helperText={emailError}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Phone"
                                        value={form.phone}
                                        onChange={e => {
                                            const val = e.target.value.replace(/\D/g, '');
                                            setForm(prev => ({ ...prev, phone: val }));
                                            setPhoneError(null);
                                        }}
                                        error={!!phoneError}
                                        helperText={phoneError}
                                        fullWidth
                                    />
                                    <TextField
                                        label="Department"
                                        select
                                        value={form.department}
                                        onChange={e => setForm(prev => ({ ...prev, department: e.target.value }))}
                                        fullWidth
                                    >
                                        <MenuItem value="Sales">Sales</MenuItem>
                                        <MenuItem value="Marketing">Marketing</MenuItem>
                                        <MenuItem value="Engineering">Engineering</MenuItem>
                                        <MenuItem value="HR">HR</MenuItem>

                                    </TextField>
                                    {/* <TextField
                                        label="Employee ID"
                                        value={form.employee_id}
                                        fullWidth
                                        disabled
                                    /> */}
                                    <TextField
                                        label="Status"
                                        select
                                        value={form.status}
                                        onChange={e => setForm(prev => ({ ...prev, status: e.target.value }))}
                                        fullWidth
                                    >
                                        <MenuItem value="pending">Pending</MenuItem>
                                        <MenuItem value="approved">Approved</MenuItem>
                                        <MenuItem value="declined">Declined</MenuItem>
                                        <MenuItem value="suspended">Suspended</MenuItem>
                                    </TextField>
                                    <TextField
                                        label="Max Cars Allowed Parking"
                                        type="number"
                                        value={form.max_cars_allowed_parking}
                                        onChange={e => {
                                            let val = Number(e.target.value);
                                            if (val > 10) val = 10;
                                            if (val < 1) val = 1;
                                            setForm(prev => ({ ...prev, max_cars_allowed_parking: val.toString() }));
                                        }}
                                        inputProps={{ min: 1, max: 10 }}
                                        fullWidth
                                    />
                                </Stack>
                            </CardContent>
                        </StyledCard>
                    </Box>
                    <Box sx={{ textAlign: 'center', mt: 4 }}>
                        <Stack direction="row" spacing={2} justifyContent="center">
                            <Button
                                variant="contained"
                                size="large"
                                onClick={handleSave}
                                disabled={saving || !form.firstName || !form.lastName || !form.email}
                                sx={{
                                    minWidth: 200,
                                    bgcolor: form.firstName && form.lastName && form.email ? 'primary.main' : 'grey.400',
                                    color: 'white',
                                    fontWeight: 700,
                                    letterSpacing: 1,
                                    borderRadius: 3,
                                    '&:hover': {
                                        bgcolor: form.baseuser_id && form.firstName && form.lastName && form.email ? 'primary.dark' : 'grey.500'
                                    }
                                }}
                            >
                                {saving
                                    ? 'Saving...'
                                    : editId
                                        ? '💾 Update User'
                                        : '💾 Save User'}
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
                                    '&:hover': {
                                        bgcolor: 'primary.main',
                                        color: 'white',
                                        borderColor: 'primary.dark'
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
                                    Are you sure you want to reset the form?
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
                                fontWeight: 600
                            }}
                        >
                            {message.text}
                        </Box>
                    )}
                    {/* Error message */}
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
                                border: '2px solid #d32f2f'
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