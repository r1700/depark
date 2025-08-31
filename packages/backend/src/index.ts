import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import session from 'express-session';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import authRoutes from './routes/auth';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import Exit from './routes/opc/exit';
import Retrival from './routes/RetrivalQueue';
import './cronJob'; // Ensure the cron job runs on server start

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware for session management
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// CORS configuration
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());

// Ensure required environment variables are set
if (!process.env.GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID in environment variables');
}

// Logger middleware
app.use(loggerRoutes);

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);
app.use('/api/tablet', Retrival);
app.use('/api/opc', Exit);

// Log all incoming requests
app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, req.body);
  next();
});

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});

// Health check route
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

// Database initialization log
if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
  console.log(':file_cabinet: Initializing database...');
} else {
  console.log(':memo: Using mock data - Supabase not configured');
}

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  console.log('✅ APIs ready!');

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Database: Supabase configured');
  } else {
    console.log('📝 Database: Using mock data');
  }
  console.log('✅ Password reset API ready!');
  console.log('🔗 Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   GET  /api/health');
  console.log('   POST /api/password/reset');
  console.log('   GET  /api/vehicle');
  console.log('   GET  /api/exportToCSV');
  console.log('   GET  /api/auth/users');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/admin/config');
  console.log('   PUT  /api/admin/config');


});
