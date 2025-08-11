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
import authRoutes from './routes/auth';
import { databaseService } from './services/database';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import { OAuth2Client } from 'google-auth-library';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(loggerRoutes);

app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, req.body);
  next();
});

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing Supabase...');
    try {
      databaseService.canInitialize();
      await databaseService.initializeSampleData();
      console.log('✅ Database initialized');
    } catch (err) {
      console.error('❌ Database init failed:', err);
    }
  } else {
    console.log('📝 Mock mode - Supabase not configured');
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});
