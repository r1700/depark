
import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express, { Router } from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import authRoutes from './routes/auth';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import Exit from './routes/opc/exit'; 
import session from 'express-session';
import adminConfigRouter from './routes/adminConfig';
import userRoutes from './routes/user.routes';
import './cronJob';
import vehicle from './routes/vehicleRoute';
import GoogleAuth from './routes/google-auth';
import parkingReport from './routes/parkingStat';
import surfaceReport from './routes/surfaceStat';
import dashboardSatistics from './routes/dashboard/dashboardStatistics.route';
import { WebSocketServer } from 'ws';
import { getDashboardSnapshot } from './services/dashboard/dashboardStatistics.service';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}) as unknown as express.RequestHandler);

const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const router = Router();

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

app.use(loggerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);
app.use('/api/vehicles', vehicle);
app.use('/api/admin', adminConfigRouter);
app.use('/OAuth', GoogleAuth);
app.use('/api/admin', adminConfigRouter);
app.use('/api/parking-stats', parkingReport);
app.use('/api/surface-stats', surfaceReport);
app.use('/api/HR-statistics', dashboardSatistics);
app.use('/api/opc', Exit);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, req.body);
  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  console.log(':file_cabinet: Initializing database...');
} else {
  console.log(':memo: Using mock data - Supabase not configured');
}

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  console.log('✅ APIs ready!');
});

const wss = new WebSocketServer({ server });

function heartbeat(this: any) {
  (this as any).isAlive = true;
}

wss.on('connection', async (ws) => {
  console.log('WS client connected');
  (ws as any).isAlive = true;
  ws.on('pong', heartbeat);

  try {
    const snapshot = await getDashboardSnapshot();
    ws.send(JSON.stringify({ type: 'update', data: snapshot }));
  } catch (err) {
    console.error('Error sending initial snapshot:', err);
  }
});

setInterval(async () => {
  try {
    const snapshot = await getDashboardSnapshot();
    const message = JSON.stringify({ type: 'update', data: snapshot });

    wss.clients.forEach((client: any) => {
      if (client.readyState === 1) {
        client.send(message);
      }
    });
  } catch (err) {
    console.error('Error broadcasting snapshot:', err);
  }
}, 1000);

setInterval(() => {
  wss.clients.forEach((ws: any) => {
    if (ws.isAlive === false) return ws.terminate();
    ws.isAlive = false;
    ws.ping();
  });
}, 30000);
