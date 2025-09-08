import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

type User = { id: number; name: string; email?: string };

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }, []);

  const login = useCallback(
    async (newToken: string) => {
      localStorage.setItem('token', newToken);
      setToken(newToken);

      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${newToken}` },
        });
        setUser(res.data.user);
      } catch {
        logout();
      }
    },
    [logout]
  );

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    if (savedToken) {
      login(savedToken);
    }
  }, [login]); // עכשיו זה בטוח לשים login פה

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
