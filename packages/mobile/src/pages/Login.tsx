import React from 'react';
import { useAuthGoogle } from '../auth/useGoogleLogin';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack } from '@mui/material';

declare const google: any;

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

export default function Login() {
  const navigate = useNavigate();
  const { handleGoogleLogin } = useAuthGoogle();

  const [popup, setPopup] = React.useState<{ message: string; color: 'error' | 'success' } | null>(null);

  const showPopup = (message: string, color: 'error' | 'success') => {
    setPopup({ message, color });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleCredentialResponse = async (response: any) => {
    if (response?.credential) {
      try {
        const success = await handleGoogleLogin(response.credential);

        if (!success) {
          showPopup('Email not registered in the system', 'error');
          return;
        }

        navigate('/dashboard');
      } catch (e) {
        showPopup('Login failed', 'error');
      }
    } else {
      showPopup('No credential received from Google', 'error');
    }
  };


  React.useEffect(() => {
    const interval = setInterval(() => {
      const google = (window as any).google;
      if (google && google.accounts && google.accounts.id) {
        google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
          callback: handleCredentialResponse,
        });

        google.accounts.id.renderButton(
          document.getElementById('googleSignInDiv')!,
          {
            theme: 'outline',
            size: 'large',
            width: 250,
          }
        );
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  const handleOtpLogin = () => {
    navigate('/otp');
  };


return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        bgcolor: 'grey.100',
      }}
    >
      <Typography variant="h4" fontWeight={700} mb={4} align="center" color="primary">
        Choose Login Method
      </Typography>

      <Stack spacing={3} alignItems="center" sx={{ width: '100%' }}>
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOtpLogin}
          sx={{ width: 250, borderRadius: 2, fontWeight: 600 }}
        >
          Sign in with Password / OTP
        </Button>

        <Box sx={{ width: 250, display: 'flex', justifyContent: 'center' }}>
          <div id="googleSignInDiv" style={{ width: '100%', height: 50 }} />
        </Box>
      </Stack>

      {popup && <PopupMessage message={popup.message} color={popup.color} />}
    </Box>
  );
}
