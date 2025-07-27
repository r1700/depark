import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import UsersPage from './Pages/UsersPage';
import Sidebar from './components/Menu/Sidebar';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
              <Route
                  path="/"
                  element={
                    <Sidebar
                      user={{
                        firstName: localStorage.getItem('firstName') ?? '',
                        lastName: localStorage.getItem('lastName') ?? ''
                      }}
                      onLogout={() => {
                        localStorage.removeItem('firstName');
                        localStorage.removeItem('lastName');
                      }}
                    />
                  }
                />

        <Route path="/users" element={<UsersPage />} />
          
      </Routes>
    </Router>
  );
};

export default App;


