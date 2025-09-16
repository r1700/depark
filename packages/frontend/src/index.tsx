import React, { useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Navigate, useNavigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './admin/app/store'; // נתיב לפי הפרויקט שלך

import { VehicleRow } from './mobile/components/mobile-user/VehicleList';
import Otp from './mobile/components/otp';
import LoginPage from './admin/Pages/loginPage';
import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword';
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import Login from './mobile/pages/Login';
import { AuthProvider } from './mobile/auth/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';

import LoginScreen from './admin/components/screen-login/LoginScreen';
import Layout from './admin/components/layout/layout';
import AdminDashboard from './admin/components/adminDashboard/AdminDashboard';
import HrDashboard from './admin/components/hrDashboard/HrDashboard';
import AdminConfigPage from './admin/components/AdminConfigPage';
import ParkingsPage from './admin/Pages/ParkingsPage';
import ParkingStatsPage from './admin/app/pages/parkingStats/parkingStats';
import SurfaceStatsPage from './admin/app/pages/surfaceStats/surfaceStats';
import UsersPage from './admin/Pages/UsersPage';
import VehiclesPage from './admin/Pages/VehiclePage';
import AdminUsersPage from './admin/Pages/adminUser/AdminUsersPage';
import ReservedParkingPage from './admin/Pages/ReservedParking';
import UnknownVehicles from './admin/components/vehicleModel/vehicleModel';
import ResolvePage from './admin/components/vehicleModel/ResolvePage';
import APIvehicle from './admin/components/APIvehicle/APIvehicle';
import AdminConfigUsers from './admin/components/AdmainConfigUsers';
import AdminLogoManagement from './admin/components/logo';
import HomePage from './tablet/components/HomePage/HomePage';

import Notifications from './mobile/components/mobile-user/Notifications';
import UnifiedEntry from './tablet/components/UnifiedEntry/UnifiedEntry';
import VehicleQueue from './tablet/components/VehicleQueue/VehicleQueue';
// helper to read user from localStorage
function getUserFromStorage() {
  try {
    const raw = localStorage.getItem('user');
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Component that redirects from /admin to /admin/login or to proper layout route depending on user
function AdminIndexRedirect() {
  const user = getUserFromStorage();
  if (!user) return <Navigate to="/admin/login" replace />;
  return String(user.role) === '2'
    ? <Navigate to="/admin/layout/admin" replace />
    : <Navigate to="/admin/layout/hr-dashboard" replace />;
}

// Protected wrapper that renders Layout (with redux Provider) and passes onLogout to layout.
// The actual nested admin pages will be rendered inside Layout via its Outlet.
function ProtectedLayoutWrapper() {
  const navigate = useNavigate();
  const user = getUserFromStorage();

  const handleLogout = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/admin/login', { replace: true });
  }, [navigate]);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  // Layout is expected to contain an <Outlet/> where nested admin routes will render.
  return (
    <Provider store={store}>
      <Layout user={user} onLogout={handleLogout} />
    </Provider>
  );
}

// Inside the layout, when the path is /admin/layout (index) we redirect to admin/hr-dashboard based on role
function LayoutIndexRedirect() {
  const user = getUserFromStorage();
  if (!user) return <Navigate to="/admin/login" replace />;
  return String(user.role) === '2'
    ? <Navigate to="admin" replace />
    : <Navigate to="hr-dashboard" replace />;
}

import { Provider } from 'react-redux';
import { store } from './admin/app/store';


const routers = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <LoginPage /> },
      {
        path: 'admin', children: [
          { path: 'login', element: <LoginScreen /> },
          { index: true, element: <AdminIndexRedirect /> }, // /admin -> redirect logic
          {
            path: 'layout',
            element: <ProtectedLayoutWrapper />,
            children: [
              { path: 'vehicles', element: <APIvehicle /> },
              { path: 'unknown-vehicles', element: <UnknownVehicles /> },
              { path: 'resolve', element: <ResolvePage /> },
              { path: 'resolve/:id', element: <ResolvePage /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'add-user', element: <AdminConfigUsers /> },
              { path: 'edit-user/:userId', element: <AdminConfigUsers /> },
              { path: 'admin-users', element: <AdminUsersPage /> },
              { path: 'logo-management', element: <AdminLogoManagement /> },
              { path: 'admin', element: <AdminDashboard /> },
              { path: 'admin-users', element: <AdminUsersPage /> },
              { path: 'reserved-parking', element: <ReservedParkingPage /> },
              { path: 'hr-dashboard', element: <HrDashboard /> },
              { path: 'admin-config', element: <AdminConfigPage /> },
              { path: 'parkings', element: <ParkingsPage /> },
              { path: 'vehicles', element: <VehiclesPage /> },
              {
                path: 'reports',
                children: [
                  { path: 'parking-stats', element: <ParkingStatsPage /> },
                  { path: 'surface-stats', element: <SurfaceStatsPage /> },
                ]
              },
              { index: true, element: <LayoutIndexRedirect /> }
            ]
          },
          { path: '*', element: <Navigate to="/admin" replace /> }
        ]
      },

      // mobile / other routes
      { path: 'mobile', element: <Login /> },
      { path: 'otp', element: <Otp /> },
      { path: 'tablet', element: localStorage.getItem("floorNumber") ? <UnifiedEntry /> : <HomePage /> }, { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'VehicleRow', element: <VehicleRow /> },
      { path: 'Notifications', element: <Notifications /> },
      { path: 'VehicleQueue', element: <VehicleQueue /> },

    ]
  }
]);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <AuthProvider>

        <RouterProvider router={routers} />
      </AuthProvider>

    </GoogleOAuthProvider>
  </React.StrictMode>
);

reportWebVitals();