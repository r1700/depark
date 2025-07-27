import React from 'react';

interface AccessDeniedProps {
  message?: string;
  showLoginButton?: boolean;
}

export default function AccessDenied({ 
  message = "אין לך הרשאה לצפות בדף זה", 
  showLoginButton = true 
}: AccessDeniedProps) {
  
  const handleLogin = () => {
    window.location.href = '/login';
  };

  const handleHome = () => {
    window.location.href = '/';
  };

  return (
    <div className="access-denied-page">
      <div className="access-denied-container">
        <div className="icon">🚫</div>
        <h1>גישה נדחתה</h1>
        <p>{message}</p>
        
        <div className="actions">
          {showLoginButton && (
            <button onClick={handleLogin} className="primary">
              התחבר
            </button>
          )}
          <button onClick={handleHome} className="secondary">
            חזור לעמוד הבית
          </button>
        </div>
      </div>
    </div>
  );
}