import React, { useState, useEffect } from 'react';

import { apiService } from './services/api';

import './App.css';
import AdminConfigPage from './components/AdminConfigPage';


  
 

    
function App() {
  return (
    // <Router>
    //   <div className="App">
    //     <Navigation />
        
    //     <Routes>
    //       {/* Home page */}
    //       <Route path="/" element={<ProtectedHome />} />
          
    //       {/* Login page */}
    //       <Route path="/login" element={<LoginPage />} />
          
    //       {/* Admin pages - protected */}
    //       <Route 
    //         path="/admin/config" 
    //         element={
    //           <AdminRoute>
    //             <AdminConfigPage />
    //           </AdminRoute>
    //         } 
    //       />
          
    //       <Route 
    //         path="/register" 
    //         element={
    //           <AdminRoute>
    //             <RegisterPage />
    //           </AdminRoute>
    //         } 
    //       />
          
    //       <Route 
    //         path="/users" 
    //         element={
    //           <AdminRoute>
    //             <UsersPage />
    //           </AdminRoute>
    //         } 
    //       />
          
    //       {/* 404 page */}
    //       <Route path="*" element={<Navigate to="/" replace />} />
    //     </Routes>
    //   </div>
    // </Router>
    <>
    <AdminConfigPage/>
    </>
  );
}

export default App;