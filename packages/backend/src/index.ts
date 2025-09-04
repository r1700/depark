// src/index.ts
import 'reflect-metadata';


import path from 'path';

// טען dotenv מיד בתחילת הריצה
const envPath = path.resolve(process.cwd(), '.env');
require('dotenv').config({ path: envPath });

console.log('NODE_ENV =', process.env.NODE_ENV || 'development');
console.log('Loaded .env from:', envPath);
console.log('JWT_SECRET loaded =', !!process.env.JWT_SECRET);

// ----------------- Imports -----------------
import express from 'express';
import cors from 'cors';

import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import authRoutes from './routes/auth';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import protect from './routes/protected';

// ----------------- App Config -----------------
const app = express();

const PORT = Number(process.env.PORT) || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'];
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

// ----------------- Middleware -----------------
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));
app.use(express.json());
app.use(loggerRoutes);

// ----------------- Routes -----------------
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);
app.use('/api/protected', protect);

// Debug log לכל בקשה (לבדיקות בלבד)
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, req.body ? req.body : '');
  next();
});

// ----------------- Basic endpoints -----------------
app.get('/', (req, res) => {
  res.json({ message: 'Depark Backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// ----------------- DB check -----------------
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  console.log('Initializing database (Supabase) ...');
} else {
  console.log('Using mock data - Supabase not configured');
}

// ----------------- Error handler -----------------
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(err.status || 500).json({ status: 'error', message: err.message || 'Internal server error' });
});

// ----------------- Start server -----------------
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('CORS enabled for:', CORS_ORIGIN);
  console.log('Available routes (examples):');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   POST /api/auth/login');
  console.log('   POST /api/auth/register');
  console.log('   GET  /api/protected/profile');
});

// ----------------- Graceful shutdown -----------------
const shutdown = () => {
  console.log('Shutting down server...');
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
};
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
