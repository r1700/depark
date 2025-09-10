import React from 'react';
import Header from '../../components/Header';
import { useAuthGoogle } from '../auth/useGoogleLogin';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Button, Stack, CircularProgress } from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';
// הרכיב PopupMessage
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
    }}
  >
    <Typography variant="body1" sx={{ mr: 2 }}>
      {message}
    </Typography>
  </Box>
);

function GoogleButtonWrapper({
  onSuccess,
  onError,
}: {
  onSuccess: (res: any) => void;
  onError: () => void;
}) {
  const [scriptLoaded, setScriptLoaded] = React.useState<boolean>(() => !!(window as any).google);

  React.useEffect(() => {
    if ((window as any).google) {
      setScriptLoaded(true);
      return;
    }

    const t = setTimeout(() => {
      setScriptLoaded(!!(window as any).google);
    }, 500);

    return () => clearTimeout(t);
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        maxWidth: 350,
        minHeight: 56,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        borderRadius: 1,
        '& iframe': {
          width: '100% !important',
          height: '100% !important',
          display: 'block',
        },
      }}
    >
      {!scriptLoaded ? (
        <CircularProgress size={24} />
      ) : (
        <GoogleLogin
          onSuccess={onSuccess}
          onError={onError}
          theme="outline"
          size="large"
          width="350"
        />
      )}
    </Box>
  );
}

export default function Login() {
  const navigate = useNavigate();
  const { handleGoogleLogin } = useAuthGoogle();
  const [popup, setPopup] = React.useState<{ message: string; color: 'error' | 'success' } | null>(null);

  const showPopup = (message: string, color: 'error' | 'success') => {
    setPopup({ message, color });
    setTimeout(() => setPopup(null), 3000);
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    if (credentialResponse?.credential) {
      try {
        const success = await handleGoogleLogin(credentialResponse.credential);
        if (!success) {
          showPopup('Email not registered in the system', 'error');
          return;
        }
        navigate('/VehicleRow');
      } catch {
        showPopup('Login failed', 'error');
      }
    } else {
      showPopup('No credential received from Google', 'error');
    }
  };

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
        px: 2,
      }}
    >
      {/* הוספת header עם ה-Logo */}
      <Header screenType="mobile" />
      
      <Typography
        variant="h1"
        fontWeight={800}
        mb={6}
        align="center"
        color="primary"
        sx={{
          fontSize: 'clamp(3rem, 7vw, 7rem)',
          letterSpacing: '-0.02em',
          textShadow: '2px 2px 6px rgba(0,0,0,0.25)',
        }}
      >
        Wellcome
      </Typography>

      <Stack
        spacing={3}
        alignItems="center"
        justifyContent="center"
        sx={{ width: '100%', maxWidth: 350, mx: 'auto' }}
      >
        <Button
          variant="contained"
          color="primary"
          size="large"
          onClick={handleOtpLogin}
          sx={{
            width: '100%',
            minWidth: 200,
            maxWidth: 350,
            borderRadius: 2,
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.1rem' },
            py: 1.5,
          }}
        >
          Sign in with OTP
        </Button>

        <GoogleButtonWrapper
          onSuccess={handleGoogleSuccess}
          onError={() => showPopup('Google login failed', 'error')}
        />
      </Stack>

      {popup && <PopupMessage message={popup.message} color={popup.color} />}
    </Box>
  );
}
