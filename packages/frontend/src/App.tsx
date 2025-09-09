import React from "react";
import { Outlet } from "react-router-dom";
import AdminUsersPage from "./admin/Pages/adminUser/AdminUsersPage";
import { store } from "./admin/app/store";
import { Provider } from "react-redux";
const App: React.FC = () => {
  // return <Outlet />;
  return (
    <Provider store={store}>
      <AdminUsersPage />;
    </Provider>);
};

export default App;
