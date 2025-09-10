import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { VehicleRow } from './mobile/components/mobile-user/VehicleList';
import Otp from './mobile/components/otp';
import HomePage from './tablet/components/HomePage/HomePage';
import LoginPage from './admin/Pages/loginPage';
import ForgotPassword from './admin/app/pages/resetPassword/ForgotPassword';
import ResetPassword from './admin/app/pages/resetPassword/ResetPassword';
import AdminRoutes from './admin/AdminRoutes';
import Notifications from './mobile/components/mobile-user/Notifications';
import Login from './mobile/pages/Login';
import { AuthProvider } from './mobile/auth/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import UnifiedEntry from './tablet/components/UnifiedEntry/UnifiedEntry';
import Dashboard from '../src/admin/Pages/hrDashboard/DashboardPage'
import { store } from './admin/app/store'; // ודא שזה הנתיב הנכון
import { Provider } from 'react-redux';

const routers = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { path: '', element: <LoginPage /> },
      { path: 'admin/*', element: <AdminRoutes /> },
      { path: 'mobile', element: <Login /> },
      { path: 'otp', element: <Otp /> },
      { path: 'tablet', element: localStorage.getItem("floorNumber") ? <UnifiedEntry /> : <HomePage /> },
      { path: 'forgot-password', element: <ForgotPassword /> },
      { path: 'reset-password', element: <ResetPassword /> },
      { path: 'VehicleRow', element: <VehicleRow /> },
      { path: 'Notifications', element: <Notifications /> },
      { path: 'hr-dashboard', element: <Dashboard /> }


    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <Provider store={store}>
        <AuthProvider>
          <RouterProvider router={routers}></RouterProvider>
        </AuthProvider>
      </Provider>
    </GoogleOAuthProvider>
  </React.StrictMode>,
);
reportWebVitals();
