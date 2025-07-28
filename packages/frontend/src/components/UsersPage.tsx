import React, { useState, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('authToken');
      
      const response = await fetch('http://localhost:3001/api/auth/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setMessage({ type: 'error', text: 'שגיאה בטעינת משתמשים' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'שגיאת רשת' });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">טוען רשימת משתמשים...</div>;
  }

  return (
    <div className="users-page">
      <div className="users-container">
        <h1>ניהול משתמשים</h1>
        <p>רשימת כל המשתמשים במערכת</p>

        {message && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}

        <div className="users-stats">
          <div className="stat-card">
            <h3>{users.filter(u => u.role === 'admin').length}</h3>
            <p>מנהלים</p>
          </div>
          <div className="stat-card">
            <h3>{users.filter(u => u.role === 'user').length}</h3>
            <p>משתמשים</p>
          </div>
          <div className="stat-card">
            <h3>{users.length}</h3>
            <p>סה"כ</p>
          </div>
        </div>

        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>שם</th>
                <th>אימייל</th>
                <th>תפקיד</th>
                <th>סטטוס</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role}`}>
                      {user.role === 'admin' ? 'מנהל' : 'משתמש'}
                    </span>
                  </td>
                  <td>
                    <span className="status-badge active">פעיל</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}