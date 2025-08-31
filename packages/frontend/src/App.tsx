import React, { useState } from 'react';
// import AddOrEditAdminUserForm from './app/pages/adminUser/AddAdminUser';
import AdminUsersPage from './app/pages/adminUser/AdminUsersPage';
// const App: React.FC = () => {
//   const [showForm, setShowForm] = useState(true);

//   return (
//     <>
//       {showForm ? (
//         <AddOrEditAdminUserForm onClose={() => setShowForm(false)} />
//       ) : (
//         <button onClick={() => setShowForm(true)}>Open Form</button>
//       )}
//     </>
//   );
// };
const App: React.FC = () => {

  return (
    <>
     
        <AdminUsersPage  />

    </>
  );
};
export default App;