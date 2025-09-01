// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import API, { setAuthToken, loginWithPassword } from "../api";

export type User = {
  id?: number;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string | number;
  permissions?: string[];
  iat?: number;
  exp?: number;
  [k: string]: any;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    try {
      return typeof window !== "undefined" ? localStorage.getItem("token") : null;
    } catch {
      return null;
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const u = typeof window !== "undefined" ? localStorage.getItem("user") : null;
      return u ? JSON.parse(u) : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const init = async () => {
      try {
        if (token && !user) {
          try {
            const res = await API.get("/auth/me");
            const data = (res as any).data;
            if (data?.user) {
              setUser(data.user);
              try {
                localStorage.setItem("user", JSON.stringify(data.user));
              } catch {}
              setAuthToken(token);
            } else {
              setAuthToken(token);
            }
          } catch {
            setAuthToken(token);
          }
        } else if (token && user) {
          setAuthToken(token);
        }
      } finally {
        setLoading(false);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    try {
      if (user) localStorage.setItem("user", JSON.stringify(user));
      else localStorage.removeItem("user");
    } catch {}
  }, [user]);

  const login = async (email: string, password: string) => {
    const data = await loginWithPassword(email, password);
    const t = data?.token ?? null;
    const u = data?.user ?? null;
    if (!t) throw new Error("No token in login response");
    setToken(String(t));
    setUser(u);
    setAuthToken(String(t));
    try {
      if (u) localStorage.setItem("user", JSON.stringify(u));
    } catch {}
    if (data.expiresAt) {
      try {
        localStorage.setItem("expiresAt", String(data.expiresAt));
      } catch {}
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    try {
      localStorage.removeItem("expiresAt");
    } catch {}
  };

  const isAdmin = !!user && (user.role === "admin" || user.role === "ADMIN" || user.role === 2);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};