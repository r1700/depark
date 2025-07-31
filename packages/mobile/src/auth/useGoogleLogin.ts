// import { useState } from 'react';
// import { loginWithGoogle } from '../services/api'; // Adjust the import path as necessary
// import { useAuthContext } from './AuthContext'; 

// export function useAuth() {
//   const [error, setError] = useState<string | null>(null);
//   const { login } = useAuthContext(); 

//   const handleGoogleLogin = async (credential: string) => {
//     try {
//       const response = await loginWithGoogle(credential);
//       login(response.token);
//     } catch (err: any) {
//       setError(err.message);
//     }
//   };

//   return { handleGoogleLogin, error };
// }

import { useState } from 'react';
import { loginWithGoogle } from '../services/api';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

export function useAuthGoogle() {
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleLogin = async (credential: string): Promise<boolean> => {
    try {
      const response = await loginWithGoogle(credential);
      await login(response.token);
      return true; 
    } catch (err: any) {
      setError(err.message);
      return false; 
    }
  };

  return { handleGoogleLogin, error };
}
