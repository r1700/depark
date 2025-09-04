// src/App.tsx

import React from "react";
import TestToken from "./TestToken";
import { AuthProvider } from "./context/AuthContext";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <TestToken />
    </AuthProvider>
  );
};

export default App;
