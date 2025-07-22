import { Router } from 'express';

const router = Router();

// משתמשים זמניים
const users = [
  {
    id: '1',
    email: 'admin@depark.com',
    password: 'admin123',
    role: 'admin',
    name: 'מנהל המערכת'
  },
  {
    id: '2',
    email: 'user@depark.com',
    password: 'user123',
    role: 'user',
    name: 'משתמש רגיל'
  }
];

// GET /api/auth/users
router.get('/users', (req, res) => {
  console.log('👥 GET /api/auth/users - Users list requested');
  
  const safeUsers = users.map(user => ({
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.name
  }));

  res.json({
    success: true,
    users: safeUsers
  });
});

// POST /api/auth/register
router.post('/register', (req, res) => {
  console.log('📝 POST /api/auth/register - Register request:', req.body);
  
  const { email, password, role, name } = req.body;

  // בדוק שהמשתמש לא קיים
  if (users.find(u => u.email === email)) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }

  // הוסף משתמש חדש
  const newUser = {
    id: (users.length + 1).toString(),
    email,
    password,
    role: role || 'user',
    name
  };

  users.push(newUser);

  console.log('✅ User registered successfully:', email);

  res.json({
    success: true,
    message: 'User registered successfully',
    user: {
      id: newUser.id,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    }
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  
  const user = users.find(u => u.email === email && u.password === password);
  
  if (!user) {
    return res.status(401).json({ success: false, error: 'Invalid credentials' });
  }

  const token = `auth_${user.id}_${Date.now()}`;

  res.json({
    success: true,
    token,
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

export default router;