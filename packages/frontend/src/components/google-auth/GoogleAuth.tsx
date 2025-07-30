import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import './GoogleAuth.css';

const GoogleAuth: React.FC = () => {

  const [message, setMessage] = useState<string | null>(null);


  const GoogleResponse = (response: CredentialResponse): void => {
    if (response.credential) {
      const idToken = response.credential;
      authenticateUser(idToken);
    }
  };


  const authenticateUser = (idToken: string): void => {
    fetch('http://localhost:3001/OAuth/verify-google-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: idToken }),
    })
      .then(async (response) => {
        const data = await response.json();
        const idToken = response.headers.get('idtoken');
        return { data, idToken };
      })
      .then(({ data, idToken }) => {
        if (data.success) {
          localStorage.setItem('token', idToken || '');
          setMessage("login successful");
        }
        else {
          setMessage(data.error);
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