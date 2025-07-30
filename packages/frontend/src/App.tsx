import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './components/layout/layout';  
import UsersPage from './Pages/UsersPage';
const App: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem('firstName');
    localStorage.removeItem('lastName');
  };

  const user = {
    firstName: localStorage.getItem('firstName') ?? '',
    lastName: localStorage.getItem('lastName') ?? '',
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout user={user} onLogout={handleLogout} />}>
          <Route path="users" element={<UsersPage />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;

