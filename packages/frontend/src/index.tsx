import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import LoginScreen from './components/screen-login/LoginScreen';
import ForgotPassword from './Pages/Password-reset/ForgotPassword';
import ResetPassword from './Pages/Password-reset/ResetPassword';
import HrDashboard from './components/hrDashboard/HrDashboard';
import AdminDashboard from './components/adminDashboard/AdminDashboard';
import Layout from './components/layout/layout';
import UsersPage from './Pages/UsersPage';

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
          { path: 'users', element: <UsersPage />},
          { path: 'reset-password', element: <ResetPassword /> },
          { path: 'forgot-password', element: <ForgotPassword /> },
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
