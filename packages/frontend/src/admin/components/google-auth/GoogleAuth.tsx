import React from 'react';
import { GoogleOAuthProvider, GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useDispatch, useSelector } from 'react-redux';
import { authenticateUser } from './GoogleAuthThunks';
import type { RootState, AppDispatch } from '../../app/store';
import './GoogleAuth.css';

const GoogleAuth: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading, error } = useSelector((s: RootState) => s.auth);

  const GoogleResponse = (response: CredentialResponse): void => {
    if (response.credential) {
      const idToken = response.credential;
      dispatch(authenticateUser(idToken));
    }
  };

  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_CLIENT_ID || ''}>
            <GoogleLogin
              onSuccess={GoogleResponse}
              onError={() => console.error('Google login failed')}
            />
            {loading && <p>Authenticating...</p>}
            {error && <p id="error">{error}</p>}
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;
