import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginScreen from './admin/components/screen-login/LoginScreen';
import HrDashboard from './admin/components/hrDashboard/HrDashboard';
import AdminDashboard from './admin/components/adminDashboard/AdminDashboard';
import Layout from './admin/components/layout/layout';
import UsersPage from './admin/Pages/UsersPage';
import { VehicleRow } from './mobile/components/mobile-user/VehicleList';
import { AuthProvider } from './context/AuthContext';  // ✅

const storedUser = JSON.parse(localStorage.getItem("user") || "{}");

// פונקציית התנתקות
const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("expiresAt");
  window.location.href = "/";
};

// פונקציית התחברות
const handleLogin = (token?: string) => {
  console.log("User logged in with token:", token);
  // כאן אפשר להפעיל לוגיקה נוספת אחרי התחברות, אם צריך
};

const routers = createBrowserRouter([
  {
    path: '/',
    element: <App />,  // האפליקציה עצמה
    children: [
      { path: '', element: <LoginScreen onLogin={handleLogin} /> },  // דף התחברות
      {
        path: 'layout',
        element: <Layout user={storedUser} onLogout={handleLogout} />,  // דף לייאאוט עם המידע של המשתמש
        children: [
          { path: 'admin-dashboard', element: <AdminDashboard /> },  // דשבורד למנהל
          { path: 'hr-dashboard', element: <HrDashboard /> },  // דשבורד HR
          { path: 'users', element: <UsersPage /> },  // דף ניהול משתמשים
          { path: 'VehicleRow', element: <VehicleRow /> }  // דף פרטי רכב
        ]
      },
    ]
  }
]);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <AuthProvider>  {/* עטיפה גלובלית של AuthContext */}
      <RouterProvider router={routers} />
    </AuthProvider>
  </React.StrictMode>
);


reportWebVitals();
