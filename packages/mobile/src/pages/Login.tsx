import React from 'react';
import { useAuthGoogle } from '../auth/useGoogleLogin';
import { useNavigate } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

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

  // React.useEffect(() => {
  //   if (typeof window !== 'undefined' && google) {
  //     google.accounts.id.initialize({
  //       client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID!,
  //       callback: handleCredentialResponse,
  //     });

  //     google.accounts.id.renderButton(
  //       document.getElementById('googleSignInDiv')!,
  //       { theme: 'outline', size: 'large' }
  //     );
  //   }
  // }, []);


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
        { theme: 'outline', size: 'large' }
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
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 bg-gray-100">
      <h2 className="text-xl font-semibold mb-4">Choose login method</h2>

      <button
        onClick={handleOtpLogin}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
      >
        Sign in with Password / OTP
      </button>

      <div className="flex justify-center w-full">
        <div id="googleSignInDiv" />
      </div>

      {popup && <PopupMessage message={popup.message} color={popup.color} />}
    </div>
  );
}
