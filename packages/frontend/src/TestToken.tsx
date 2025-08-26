// src/TestToken.tsx
import React, { useState } from "react";
import API from "./api";
import { useAuth } from "./context/AuthContext";

export default function TestToken() {
  const { user, login, logout, isAdmin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState<string>("");

  const handleLogin = async () => {
    setResult("");
    try {
      await login(email, password);
      setResult("Login success");
    } catch (e: any) {
      setResult("Login failed: " + (e.response?.data?.message || e.message));
    }
  };

  const checkToken = async () => {
    setResult("");
    try {
      const res = await API.get("/protected/profile");
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err: any) {
      setResult("Protected error: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>TestToken (Auto login)</h2>

      {!user ? (
        <div style={{ marginBottom: 12 }}>
          <input placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} style={{ marginRight: 8 }} />
          <input placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ marginRight: 8 }} />
          <button onClick={handleLogin}>Login</button>
        </div>
      ) : (
        <div style={{ marginBottom: 12 }}>
          <div>Logged in as: {user.email} (role: {String(user.role)})</div>
          <button onClick={logout}>Logout</button>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <button onClick={checkToken} disabled={!isAdmin} style={{ padding: "8px 16px", backgroundColor: isAdmin ? "#4CAF50" : "#999", color: "white", border: "none", borderRadius: 4 }}>
          בדוק /protected/profile
        </button>
        {!isAdmin && user && <div style={{ color: "red", marginTop: 8 }}>אין הרשאה — דרוש Admin</div>}
      </div>

      <pre style={{ background: "#f4f4f4", padding: 10, borderRadius: 4, whiteSpace: "pre-wrap" }}>
        {result || "תוצאות יופיעו כאן"}
      </pre>
    </div>
  );
}