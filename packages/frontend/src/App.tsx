import React from 'react';
import Sidebar from './components/Menu/Sidebar';

const App: React.FC = () => {
  return (
    <div>
      <Sidebar user={{ firstName: localStorage.getItem('firstName') ?? '', lastName: localStorage.getItem('lastName') ?? '' }} onLogout={function (): void {
        localStorage.removeItem('firstName');
        localStorage.removeItem('lastName');
      }} />
    </div>
  );
};

export default App; 



