import React, { useState } from 'react';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';
import './GoogleAuth.css';

const GoogleAuth: React.FC = () => {

  const [answer, setAnswer] = useState<string | null>(null);

  const responseGoogle = (response: any): void => {
    if (!response.error) {
      const idToken = response.credential;
      authenticateUser(idToken);
    }

    return;
  };

  const authenticateUser = (idToken: string): void => {
    fetch('http://localhost:3001/OAuth/verify-google-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken: idToken }),
    })
      .then((response) => response.json())
      .then((data: any) => {
        if (data.success) {
          localStorage.setItem('token', idToken);
          setAnswer("login successful");
        }
        else{
          setAnswer(data.error);
        }
      })
      .catch((error) => {
      });
  };

  return (
    <GoogleOAuthProvider clientId="263731331737-828dn63isghps9ihmr694amas0ka245m.apps.googleusercontent.com">
      <div>
        <h1>Sign in with Google</h1>
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => setAnswer('Google login failed')}
        />
        {answer && <p>{answer}</p>}
      </div>
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;