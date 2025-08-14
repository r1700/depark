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
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import Exit from './routes/opc/exit'; // Import the exit route
import session from 'express-session';
import './cronJob'; // Import the cron job to ensure it runs on server start

// import adminConfigRouter from './routes/adminConfig';
// import retrieveRoute from './routes/RetrivalQueue';
import vehicleLookupRoute from './routes/vehicleLookup';

const app = express();
const PORT = process.env.PORT || 3001;


app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboard cat',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }
}));

// Middleware
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
// if (!GOOGLE_CLIENT_ID) {
//   throw new Error('Missing GOOGLE_CLIENT_ID');
// }
app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
app.use(loggerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/vehicle', vehicleLookupRoute);
app.use('/api/exportToCSV', exportToCSV);
// app.use('/api/users', userFilter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, req.body);
  next();
});

app.use('/api/opc', Exit);

// Start server - בסוף!
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
  
  console.log('🔗 Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   GET  /api/health');
  console.log('   POST /api/password/reset');
  console.log('   GET  /api/vehicle');
  console.log('   GET  /api/exportToCSV');
  
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Database: Supabase configured');
  } else {
    console.log('📝 Database: Using mock data');
  }
  console.log('✅ Password reset API ready!');
  console.log('🔗 Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   GET  /api/auth/users');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/admin/config');
  console.log('   PUT  /api/admin/config');

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log(':file_cabinet: Initializing database...');
  } else {
    console.log(':memo: Using mock data - Supabase not configured');
  }
});
