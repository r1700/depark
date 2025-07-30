import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import session from 'express-session';
import googleAuth from './routes/google-auth';
import auth from './routes/auth';

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware setup
app.use(session({
  secret: 'your-secret-key', // Change to your own secret!
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // For localhost, set to true if using https
}));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(loggerRoutes);

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/OAuth', googleAuth);
app.use('/auth', auth);

app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  console.log('✅ APIs ready!');
  console.log('🔗 Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   GET  /api/health');
  console.log('   GET  /api/auth/users');
  console.log('   POST /api/auth/register');
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/admin/config');
  console.log('   PUT  /api/admin/config');
  console.log('   POST /api/password/reset');
  console.log('   GET  /api/vehicle');
  console.log('   GET  /api/exportToCSV');

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Database: Supabase configured');
  } else {
    console.log('📝 Database: Using mock data');
  }
});