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
