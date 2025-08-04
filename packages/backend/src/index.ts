import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import adminConfigRouter from './routes/adminConfig';
import session from 'express-session';


const app = express();

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';

// app.use(session({
//   secret: 'your-secret-key', 
//   resave: false,
//   saveUninitialized: true,
//   cookie: { secure: false } 
// }));

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(loggerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/admin',adminConfigRouter);
app.use('/api/exportToCSV', exportToCSV);


// Routes - הגדר לפני app.listen!
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
  console.log('🗄️ Initializing database...');
} else {
  console.log('📝 Using mock data - Supabase not configured');
}

// Start server - בסוף!
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  console.log('✅ Password reset API ready!');
  console.log('🔗 Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   GET  /api/auth/users');      // 👈 חשוב!
  console.log('   POST /api/auth/register');   // 👈 חשוב!
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/admin/config');
  console.log('   PUT  /api/admin/config');
  console.log('✅ APIs ready!');
  console.log('   GET  /api/health');
  console.log('   POST /api/password/reset');
  console.log('   GET  /api/vehicle');
  console.log('   GET  /api/exportToCSV');
});

