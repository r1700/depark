import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import adminUsersRouter from './routes/admin/adminUsers';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';

const app = express();

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Middleware setup
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(loggerRoutes);
app.use('/admin', adminUsersRouter);
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);

app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});

<<<<<<< HEAD
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
=======
app.listen(PORT, async () => {
  // בדוק את הערכים של משתני הסביבה
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  // index.js או app.js


// המשך עם הקוד שלך להתחברות למסד הנתונים

  // Initialize database with sample data if using Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
    try {
      databaseService.canInitialize();
      try {
        await databaseService.initializeSampleData();
        console.log('✅ Database initialized successfully');  
      } catch (error) {
        console.error('❌ Database sample-data initialization failed');
      }
    } catch (error) {
      console.error('❌ Database not connected');
    }
  } else {
    console.log('📝 Using mock data - Supabase not configured');
  }
>>>>>>> 414aa1fb (start Subscribe to PLC Data Changes in OPC-UA)
});