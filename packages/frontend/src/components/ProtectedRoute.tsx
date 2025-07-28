import React, { useEffect, useState } from 'react';
import AccessDenied from './AccessDenied';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'admin' | 'user';
}

export default function ProtectedRoute({ children, requiredRole = 'user' }: ProtectedRouteProps) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [hasAccess, setHasAccess] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:3001/api/auth/verify', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await response.json();

      if (data.success) {
        setUser(data.user);
        
        // בדיקת הרשאות
        if (requiredRole === 'admin' && data.user.role !== 'admin') {
          setHasAccess(false);
        } else {
          setHasAccess(true);
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">טוען...</div>;
  }

  if (!user) {
    return <AccessDenied message="יש להתחבר כדי לצפות בדף זה" />;
  }

  if (!hasAccess) {
    return <AccessDenied message="אין לך הרשאות מספיקות לצפות בדף זה" showLoginButton={false} />;
  }

  return <>{children}</>;
}