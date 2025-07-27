import React, { useState } from 'react';
import { TextField, Button, Alert, Container, Typography, Box } from '@mui/material';

function Otp() {
    const [contact, setContact] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    // Handle sending OTP
    const sendOtp = async () => {
        setError('');
        setMessage('');

        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
        const isPhone = /^\+\d{6,15}$/.test(contact);

        if (!isEmail && !isPhone) {
            setError('Please enter a valid email address or international phone number (e.g., +97212345678).');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/otp/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setOtpSent(true);
                setMessage(data.message || 'OTP sent successfully.');
            } else {
                setError(data.error || 'Failed to send OTP.');
            }
        } catch (err) {
            setError('An error occurred while sending the OTP.');
        }
    };

    // Handle OTP verification
    const verifyOtp = async () => {
        setError('');
        setMessage('');

        if (otp.length !== 6) {
            setError('Please enter the full 6-digit code.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/otp/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contact, otp }),
            });

            const data = await response.json();

            if (response.status === 200) {
                setMessage('Code verified successfully!');
            } else {
                setError(data.error || 'Invalid code.');
            }
        } catch (err) {
            setError('An error occurred during verification.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ textAlign: 'center', marginTop: 4, padding: 4, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Sign In with a Verification Code
                </Typography>

                {!otpSent ? (
                    <Box>
                        <TextField
                            label="Enter Email or Phone"
                            variant="outlined"
                            fullWidth
                            value={contact}
                            onChange={(e) => setContact(e.target.value)}
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={sendOtp}
                            sx={{ marginTop: 2 }}
                        >
                            Continue
                        </Button>
                    </Box>
                ) : (
                    <Box>
                        <TextField
                            label="Enter Code"
                            variant="outlined"
                            fullWidth
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                            margin="normal"
                            inputProps={{
                                maxLength: 6,
                                style: {
                                    textAlign: 'center',
                                    fontSize: '24px',
                                    fontWeight: 'bold',
                                    padding: '10px',
                                    letterSpacing: '8px',
                                    borderRadius: '8px',
                                },
                            }}
                            sx={{
                                marginBottom: 2,
                                '& .MuiOutlinedInput-root': {
                                    '& fieldset': { borderColor: '#3f51b5' },
                                    '&:hover fieldset': { borderColor: '#1976d2' },
                                    '&.Mui-focused fieldset': { borderColor: '#1976d2' },
                                },
                            }}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            fullWidth
                            onClick={verifyOtp}
                            sx={{ marginTop: 2, backgroundColor: '#1976d2', ':hover': { backgroundColor: '#0763bf' } }}
                        >
                            Verify
                        </Button>
                    </Box>
                )}

                {/* Alert messages */}
                {error && <Alert severity="error" sx={{ marginTop: 2 }}>{error}</Alert>}
                {message && <Alert severity="success" sx={{ marginTop: 2 }}>{message}</Alert>}
            </Box>
        </Container>
    );
}

export default Otp;
