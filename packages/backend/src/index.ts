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
import Exit from './routes/opc/exit'; // Import the exit route
import faultsRouter from './routes/opc/faults';
import techniciansRoutes from "./routes/opc/technicians";
import http from 'http';
import { WebSocketServer } from 'ws';
import session from 'express-session';
import adminConfigRouter from './routes/adminConfig';
import userRoutes from './routes/user.routes';

import logoRouter from './routes/logos';
import screenTypeRouter from './routes/screenType';
import './cronJob'; // Import the cron job to ensure it runs on server start
import vehicle from './routes/vehicleRoute';
import GoogleAuth from './routes/google-auth';
import parkingReport from './routes/parkingStat';
import surfaceReport from './routes/surfaceStat';
import retrieveRoute from './routes/RetrivalQueue';
import otpRoutes from './routes/otp.server';
const app = express();
const server = http.createServer(app);
export const wss = new WebSocketServer({ server })
app.use(express.json());

// --- DEBUG: log incoming requests and who sends responses ---
app.use((req, res, next) => {
    console.log(`[REQ] ${ new Date().toISOString() } ${ req.method } ${ req.originalUrl } body:`, req.body);
    const origJson = res.json.bind(res);
    const origSend = res.send.bind(res);

    res.json = function (body) {
        console.log(`[DEBUG] res.json called for ${ req.method } ${ req.originalUrl } with body:`, body);
        console.trace();
        return origJson(body);
    };

    res.send = function (body) {
        console.log(`[DEBUG] res.send called for ${ req.method } ${ req.originalUrl } with body:`, body);
        console.trace();
        return origSend(body);
    };

    next();
});
// --- end DEBUG ---
const PORT = process.env.PORT || 3001;
// Serve static logos
app.use('/logos', express.static(path.join(process.cwd(), 'public/logos')));


app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }
}) as unknown as express.RequestHandler);

// Middleware
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
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
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api', userRoutes);
// app.use('/api/users', userFilter);
// app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);
app.use('/api/vehicles', vehicle)
app.use('/api/admin', adminConfigRouter);
app.use('/OAuth', GoogleAuth);
app.use('/api/admin', adminConfigRouter);
app.use('/api/parking-stats', parkingReport);
app.use('/api/surface-stats', surfaceReport);
app.use('/api/tablet', retrieveRoute);
app.use('/api/otp', otpRoutes);

app.use('/api/logos', logoRouter);
app.use('/api/screentypes', screenTypeRouter);
app.use('/logos', express.static(path.join(process.cwd(), 'public/logos')));

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
 app.listen(PORT, () => {
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
