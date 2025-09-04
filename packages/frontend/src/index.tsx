import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { VehicleRow } from './mobile/components/mobile-user/VehicleList';
import Otp from './mobile/components/otp';
import HomePage from './tablet/pages/HomePage';
import AdminConfigPage from './admin/components/AdminConfigPage';
import ParkingsPage from './admin/Pages/ParkingsPage';
import LoginPage from './admin/Pages/loginPage';
import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword';
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import AdminRoutes from './admin/AdminRoutes';
import Login from './mobile/pages/Login';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './mobile/auth/AuthContext';
import UnifiedEntry from './tablet/components/UnifiedEntry/UnifiedEntry';
const routers = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { path: '', element: <LoginPage /> },
      { path: 'admin/*', element: <AdminRoutes /> },
      { path: 'mobile', element: <Login /> },
      { path: 'otp', element: <Otp /> },
      { path: 'tablet', element: localStorage.getItem("floorNumber") ? <UnifiedEntry /> : <HomePage /> },
      { path: 'parkings', element: <ParkingsPage /> },
      { path: 'admin-config', element: <AdminConfigPage /> },
      { path: 'admin-config/:lotId', element: <AdminConfigPage /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'VehicleRow', element: <VehicleRow /> },
    ]
  }
])
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
     <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <AuthProvider>
        <RouterProvider router={routers} />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
reportWebVitals();