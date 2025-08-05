import express from 'express';
import cors from 'cors';
import { Pool } from 'pg';
import dotenv from 'dotenv';
import net from 'net';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
}));

app.use(express.json());

// יצירת Pool של PostgreSQL מחובר לפי משתני הסביבה
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT) || 5432,
});

// נקודת API לשליפת רכבים לפי userId
app.get('/api/vehicles', async (req, res) => {
  const userId = req.query.userId;
  if (!userId || typeof userId !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid userId' });
  }

  try {
    const query = `
      SELECT 
        id, 
        license_plate AS "licensePlate", 
        model, 
        location
      FROM vehicles
      WHERE user_id = $1
    `;

    const result = await pool.query(query, [userId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Database query error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});

// פונקציה לבדיקת זמינות פורט
function checkPortAvailable(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', (err: any) => {
      resolve(err.code !== 'EADDRINUSE');
    });
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    server.listen(port);
  });
}

// הפעלת השרת עם בדיקת פורט
async function startServer() {
  const PORT = Number(process.env.PORT) || 3001;
  const isAvailable = await checkPortAvailable(PORT);
  if (!isAvailable) {
    console.error(`Port ${PORT} is already in use. Please free this port or change the PORT environment variable.`);
    process.exit(1);
  }
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();