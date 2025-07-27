import React from 'react';
import { Navigate } from 'react-router-dom';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
  name: string;
}

interface AdminRouteProps {
  children: React.ReactNode;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
  // קבלת נתוני המשתמש מ-localStorage
  const getUserFromStorage = (): User | null => {
    try {
      const userData = localStorage.getItem('user');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  };

  const user = getUserFromStorage();

  // אם אין משתמש מחובר - הפניה לדף התחברות
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // אם המשתמש לא מנהל - הצג הודעת שגיאה
  if (user.role !== 'admin') {
    return (
      <div className="access-denied">
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to access this page.</p>
        <p>Admin privileges required.</p>
        <button onClick={() => window.history.back()}>
          Go Back
        </button>
      </div>
    );
  }

  // אם המשתמש הוא מנהל - הצג את הדף
  return <>{children}</>;
};

export default AdminRoute;