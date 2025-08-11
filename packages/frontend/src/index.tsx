import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginScreen from './admin/components/screen-login/LoginScreen';
import HrDashboard from './admin/components/hrDashboard/HrDashboard';
import AdminDashboard from './admin/components/adminDashboard/AdminDashboard';
import Layout from './admin/components/layout/layout';
import UsersPage from './admin/Pages/UsersPage';
import ParkingStatsPage from './admin/app/pages/adminDashBoard/parkingStats';
import SurfaceStatsPage from './admin/app/pages/adminDashBoard/surfaceStats';

const user = JSON.parse(localStorage.getItem("user") || "{}");

const handleLogout = () => {
  localStorage.removeItem(user);
};

const routers = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { path: '', element: <LoginScreen /> },
      {
        path: 'layout', element: <Layout user={user} onLogout={handleLogout} />, children: [
          { path: 'admin-dashboard', element: <AdminDashboard /> },
          { path: 'hr-dashboard', element: <HrDashboard /> },
          { path: 'users', element: <UsersPage /> },
          { path: 'reports/parking-stats', element: <ParkingStatsPage /> },
          { path: 'reports/surface-stats', element: <SurfaceStatsPage /> },
        ]
      },

    ]
  }
])

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={routers}></RouterProvider>
  </React.StrictMode>,
);


reportWebVitals();
