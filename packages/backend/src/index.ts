import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import Exit from './routes/opc/exit';
import faultsRouter from './routes/opc/faults';
import techniciansRoutes from "./routes/opc/technicians";
import http from 'http';
import { WebSocketServer } from 'ws';
import session from 'express-session';
import adminConfigRouter from './routes/adminConfig';
import userRoutes from './routes/user.routes';
import logoRouter from './routes/logos';
import screenTypeRouter from './routes/screenType';
import './cronJob';
import vehicle from './routes/vehicleRoute';
import GoogleAuth from './routes/google-auth';
import parkingReport from './routes/parkingStat';
import surfaceReport from './routes/surfaceStat';
import userApi from './routes/userApi';
import ResevedParking from './routes/reservedparkingApi';
import retrieveRoute from './routes/RetrivalQueue';
import otpRoutes from './routes/otp.server';
import path from 'path';

const app = express();
const server = http.createServer(app);
export const wss = new WebSocketServer({ server });

// אם ריצת הפרודקשן מאחורי פרוקסי (Render, Heroku וכו') יש צורך בכך כדי שה‑secure cookie יעבוד נכון
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// JSON body parser — רק פעם אחת
app.use(express.json());

// --- CORS: תמיכה ברשימת origins דינמית ---
const rawOrigins = process.env.CORS_ORIGINS || process.env.CORS_ORIGIN || 'http://localhost:3000';
const allowedOrigins = rawOrigins.split(',').map(o => o.trim()).filter(Boolean);

// Middleware של CORS — תמיד לפני session
app.use(cors({
  origin: (origin, callback) => {
    // origin === undefined for non-browser requests (curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    console.warn(`Blocked CORS origin: ${origin}`);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// אופציה: מענה ל־preflight לכולם
app.options('*', cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// --- Session: אחרי CORS (כדי שהעוגיה תשלח ותתקבל נכון) ---
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // רק בפרודקשן צריך HTTPS
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax', // 'none' נדרש ל־cross-site cookies
    // אפשר להוסיף maxAge אם רוצים
  }
}) as unknown as express.RequestHandler);

// --- DEBUG: log incoming requests and responses (אשר להשתמש בזה רק בסביבת פיתוח) ---
app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} body:`, req.body);
  const origJson = res.json.bind(res);
  const origSend = res.send.bind(res);

  res.json = function (body) {
    console.log(`[DEBUG] res.json called for ${req.method} ${req.originalUrl} with body:`, body);
    // console.trace(); // אם רוצים trace עמוק - אפשר להפעיל
    return origJson(body);
  };

  res.send = function (body) {
    console.log(`[DEBUG] res.send called for ${req.method} ${req.originalUrl} with body:`, body);
    // console.trace();
    return origSend(body);
  };

  next();
});

// בדיקה ש‑GOOGLE_CLIENT_ID קיים (כמו בקוד שלך)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

// רישום נוסף/לוגים
app.use(loggerRoutes);

// API routes (כמו שהיה אצלך)
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api', userRoutes);
app.use('/api/users', userApi);
app.use('/api/reservedparking', ResevedParking);
app.use('/api/auth', userGoogleAuthRoutes);
app.use('/api/vehicles', vehicle);
app.use('/api/admin', adminConfigRouter);
app.use('/OAuth', GoogleAuth);
app.use('/api/parking-stats', parkingReport);
app.use('/api/surface-stats', surfaceReport);
app.use('/api/tablet', retrieveRoute);
app.use('/api/otp', otpRoutes);
app.use('/api/logos', logoRouter);
app.use('/api/screentypes', screenTypeRouter);
app.use('/logos', express.static(path.join(process.cwd(), 'public/logos')));

// אופקיות OPC
app.use('/api/opc', techniciansRoutes);
app.use('/api/opc', faultsRouter);
app.use('/api/opc', Exit);

// Print registered routes — שים לב: זה נותן הרבה פלט אבל שימושי לדיבג
function printRoutes() {
  console.log("Registered routes:");
  app._router?.stack?.forEach((middleware: any) => {
    if (middleware.route) {
      const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
      console.log(`${methods} ${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
      middleware.handle.stack.forEach((handler: any) => {
        if (handler.route) {
          const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
          console.log(`${methods} ${handler.route.path}`);
        }
      });
    }
  });
}
printRoutes();

// Root & health
app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server using the HTTP server (חשוב עבור WebSocket)
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS allowed origins: ${allowedOrigins.join(', ')}`);
  console.log('✅ APIs ready!');
});