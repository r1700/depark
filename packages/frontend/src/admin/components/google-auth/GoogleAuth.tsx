import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import './GoogleAuth.css';

interface GoogleAuthProps {
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;  // פרופס מ-LoginScreen
}
const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const GoogleAuth: React.FC<GoogleAuthProps> = ({ setLogin }) => {
  const [message, setMessage] = useState<string | null>(null);

  const GoogleResponse = (response: CredentialResponse): void => {
    if (response.credential) {
      const idToken = response.credential;
      authenticateUser(idToken);
    }
  };

  const authenticateUser = (idToken: string): void => {
    fetch(`${API_BASE}/OAuth/verify-google-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken: idToken }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        if (data.success) {
          localStorage.setItem('token', data.idToken);
          localStorage.setItem("user", JSON.stringify(data.user));
          setLogin(true);
        } else {
          setMessage(data.error || 'Authentication failed');
        }
      })
      .catch((error) => {
        setMessage('Authentication failed');
      });
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID || ''}>
      <div>
        <GoogleLogin
          onSuccess={GoogleResponse}
          onError={() => setMessage('Google login failed')}
        />
        {message && <p>{message}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
