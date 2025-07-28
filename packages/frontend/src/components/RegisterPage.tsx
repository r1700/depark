import React, { useState } from 'react';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    role: 'user'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: 'success', text: 'משתמש נרשם בהצלחה!' });
        setFormData({ email: '', password: '', name: '', role: 'user' });
      } else {
        setMessage({ type: 'error', text: data.error || 'שגיאה ברישום משתמש' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאת רשת' });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <h1>הוספת משתמש חדש</h1>
        <p className="subtitle">רק מנהלים יכולים להוסיף משתמשים חדשים</p>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label>שם מלא:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="הכנס שם מלא..."
              required
            />
          </div>

          <div className="form-group">
            <label>אימייל:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="הכנס כתובת אימייל..."
              required
            />
          </div>

          <div className="form-group">
            <label>סיסמה:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="הכנס סיסמה..."
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label>תפקיד:</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              required
            >
              <option value="user">משתמש רגיל</option>
              <option value="admin">מנהל מערכת</option>
            </select>
          </div>

          <button type="submit" disabled={loading} className="register-btn">
            {loading ? 'מוסיף משתמש...' : 'הוסף משתמש'}
          </button>
        </form>

        <div className="role-explanation">
          <h3>הסבר על התפקידים:</h3>
          <ul>
            <li><strong>משתמש רגיל:</strong> גישה לדפים בסיסיים, חיפוש חניה</li>
            <li><strong>מנהל מערכת:</strong> גישה מלאה, הגדרות מערכת, ניהול משתמשים</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
