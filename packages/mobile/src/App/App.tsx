// import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
// import { AuthProvider } from '../auth/AuthContext';
// import { GoogleOAuthProvider } from '@react-oauth/google';
// import { ProtectedRoute } from '../auth/ProtectedRoute';
// import Login from '../pages/Login';
// import Dashboard from '../pages/Dashboard';
// console.log('GOOGLE CLIENT ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID); 

// export default function App() {
//   return (
//    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
//   <BrowserRouter>
//     <AuthProvider>
//       <Routes>
//         <Route path="/login" element={<Login />} />
//         <Route path="/dashboard" element={
//           <ProtectedRoute>
//             <Dashboard />
//           </ProtectedRoute>
//         } />
//         <Route path="*" element={<Navigate to="/login" replace />} />
//       </Routes>
//     </AuthProvider>
//   </BrowserRouter>
// </GoogleOAuthProvider>
//   );
// }

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { AuthProvider } from '../auth/AuthContext';
import { ProtectedRoute } from '../auth/ProtectedRoute';
import Login from '../pages/Login';
import Dashboard from '../pages/Dashboard';
import Otp from '../component/otp';

console.log('GOOGLE CLIENT ID:', process.env.REACT_APP_GOOGLE_CLIENT_ID);

const theme = createTheme();

export default function App() {
  return (
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/otp" element={<Otp />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </ThemeProvider>
    </GoogleOAuthProvider>
  );
}
