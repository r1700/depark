import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import session from 'express-session';
import path from 'path';
import fs from 'fs';

import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import authRoutes from './routes/auth';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import Exit from './routes/opc/exit';
import faultsRouter from './routes/opc/faults';
import techniciansRoutes from "./routes/opc/technicians";
import adminConfigRouter from './routes/adminConfig';
import userRoutes from './routes/user.routes';
import logoRouter from './routes/logos';
import screenTypeRouter from './routes/screenType';
import './cronJob';
import vehicle from './routes/vehicleRoute';
import GoogleAuth from './routes/google-auth';
import parkingReport from './routes/parkingStat';
import surfaceReport from './routes/surfaceStat';
import  VehicleModelRouter  from './routes/vehicleModel';

const app = express();
const PORT = process.env.PORT || 3001;

// יצירת תיקיית public/logos אם לא קיימת
const logosDir = path.join(process.cwd(), 'public/logos');
fs.mkdirSync(logosDir, { recursive: true });

// Middlewares בסיסיים (רק פעם אחת)
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use('/logos', express.static(path.join(process.cwd(), 'public/logos')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}) as any); 

app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} body:`, req.body);
  
  const origJson = res.json.bind(res);
  const origSend = res.send.bind(res);
  
  res.json = function (body: any) {
    console.log(`[DEBUG] res.json called for ${req.method} ${req.originalUrl} with body:`, body);
    console.trace();
    return origJson(body);
  };
  
  res.send = function (body: any) {
    console.log(`[DEBUG] res.send called for ${req.method} ${req.originalUrl} with body:`, body);
    console.trace();
    return origSend(body);
  };
  
  next();
});

if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

app.use((req, res, next) => {
  console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} body:`, req.body);
  next();
});

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
app.use('/api/parking-stats', parkingReport);
app.use('/api/surface-stats', surfaceReport);

app.use('/api/unknown-vehicles', VehicleModelRouter);

app.use('/api/logos', logoRouter);
app.use('/api/screentypes', screenTypeRouter);

app.use("/api/opc", techniciansRoutes);
app.use('/api/opc', faultsRouter);
app.use('/api/opc', Exit);

function printRoutes() {
  const router = (app as any)._router;
  if (!router) {
    console.warn('printRoutes: no router found on app');
    return;
  }

  const stack = router.stack || [];
  console.log('Registered routes:');

  for (const layer of stack) {
    if (!layer) continue;

    if (layer.route && layer.route.path) {
      const methods = layer.route.methods
        ? Object.keys(layer.route.methods).filter(m => (layer.route.methods as any)[m]).map(m => m.toUpperCase()).join(',')
        : '*';
      console.log(`  ${methods.padEnd(6)} ${layer.route.path}`);
      continue;
    }

    if (layer.name === 'router' && layer.handle && Array.isArray(layer.handle.stack)) {
      for (const nested of layer.handle.stack) {
        if (!nested) continue;
        if (nested.route && nested.route.path) {
          const methods = nested.route.methods
            ? Object.keys(nested.route.methods).filter(m => (nested.route.methods as any)[m]).map(m => m.toUpperCase()).join(',')
            : '*';
          console.log(`  ${methods.padEnd(6)} ${nested.route.path}`);
        }
      }
      continue;
    }

  }
}

printRoutes();

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

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  console.log('✅ APIs ready!');
});
