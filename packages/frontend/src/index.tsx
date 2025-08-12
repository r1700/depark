import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
// import LoginScreen from './admin/components/screen-login/LoginScreen';
// import { VehicleRow } from './mobile/components/mobile-user/VehicleList';
import LoginScreen from './components/screen-login/LoginScreen';
import HrDashboard from './components/hrDashboard/HrDashboard';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import Layout from './components/layout/layout';
import UsersPage from './Pages/UsersPage';
import APIvehicle from './components/APIvehicle/APIvehicle';

const user = JSON.parse(localStorage.getItem("user") || "{}");

const handleLogout = () => {
  localStorage.removeItem(user);
};

const routers = createBrowserRouter([
  {
    path: '/', element: <App />, children: [
      { path: '', element: <APIvehicle /> },
      {
        path: 'layout', element: <Layout user={user} onLogout={handleLogout} />, children: [
          { path: 'admin-dashboard', element: <AdminDashboard /> },
          { path: 'hr-dashboard', element: <HrDashboard /> },
          { path: 'users', element: <UsersPage />},
          // { path: 'VehicleRow', element: <VehicleRow />}
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
