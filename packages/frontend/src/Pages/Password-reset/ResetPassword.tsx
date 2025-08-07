import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');
  const userId = searchParams.get('userId');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/api/password/reset', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, userId, password, confirmPassword }),
    });
    const data = await res.json();
    setMessage(data.message || data.error);

    if (data.message && data.message.includes('success')) {
      setTimeout(() => {
        navigate('/');
      }, 1500);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "#fafafa"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(33,150,243,0.12)",
        padding: "40px 32px",
        minWidth: "400px",
        maxWidth: "90vw",
        textAlign: "center"
      }}>
        <h2 style={{ color: "#2196f3", fontWeight: "bold", marginBottom: 8 }}>Reset Password</h2>
        <p style={{ color: "#666", marginBottom: 24, fontSize: "1.1em" }}>
          Enter a new password and confirm password to reset your account password
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              marginBottom: 20,
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #2196f3",
              width: "100%",
              fontSize: "1em",
              direction: "ltr"
            }}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            style={{
              marginBottom: 20,
              padding: "12px",
              borderRadius: "8px",
              border: "1.5px solid #2196f3",
              width: "100%",
              fontSize: "1em",
              direction: "ltr"
            }}
            required
          />
          <button
            type="submit"
            style={{
              background: "#2196f3",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "14px",
              fontWeight: "bold",
              fontSize: "1em",
              cursor: "pointer",
              width: "100%",
              marginBottom: 8
            }}
          >
            Reset Password
          </button>
        </form>
        {message && (
          <div style={{
            marginTop: 18,
            color: message.includes("success") || message.includes("Password changed") ? "green" : "red",
            fontWeight: "bold",
            fontSize: "1em"
          }}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;