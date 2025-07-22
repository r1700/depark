
import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // הוספת bcrypt
import { Pool } from 'pg';

const router = Router();

const pool = new Pool({
  user: 'postgres',
  host: '127.0.0.1', // לשנות בעת החיבור לענן
  database: 'user',
  password: '1333',
  port: 5432,
});

const JWT_SECRET = 'EverythingFromAboveAndUnderSuperVision'; // החלף למפתח סודי אמיתי
router.get('/', (req, res) => {
  res.json({
    success: false,
    data: {
      status: 'healtahy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development'
    }
  });
  res.send('Good Morning');
});
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    //         // חיפוש משתמש לפי אימייל במסד הנתונים
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0]; // המידע של המשתמש מהמסד נתונים

    //         // השוואת הסיסמה שהמשתמש הזין לסיסמה המוצפנת במסד הנתונים
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    //         // יצירת טוקן
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    res.json({
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,  // תוודא שהשמות תואמים לעמודת הטבלה
        lastName: user.last_name,    // תוודא שהשמות תואמים לעמודת הטבלה
        role: user.role,
        permissions: user.permissions,
      },
      token,
      expiresAt,
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/signup', async (req, res) => {
  console.log('Signup request received');
  const { email, password, firstName, lastName } = req.body;

  try {
    // הצפן את הסיסמה
    const hashedPassword = await bcrypt.hash(password, 10); // 10 הוא מספר הסיבובים של ה-salt

    // הוספת המשתמש עם הסיסמה המוצפנת למסד הנתונים
    await pool.query(
      'INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4)',
      [email, hashedPassword, firstName, lastName]
    );

    res.status(201).json({ message: 'User created successfully!' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
