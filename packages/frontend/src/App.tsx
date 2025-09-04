// src/App.tsx
import React from "react";
import { Outlet } from "react-router-dom";

// רק תציג את ה-Outlet, כל הדפים ידרשו להיות מתואמים ב-router
const App: React.FC = () => {
  return <Outlet />;
};

export default App;
