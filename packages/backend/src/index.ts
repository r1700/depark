import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import adminUsersRouter from './routes/admin/adminUsers';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import { databaseService } from './services/database';


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



app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  
  // Initialize database with sample data if using Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
    try {
      databaseService.canInitialize();
      try {
       
        
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
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

console.log('🔗 Available routes:');
console.log('   GET  /');
console.log('   GET  /health');
console.log('   GET  /api/auth/users');      // 👈 חשוב!
console.log('   POST /api/auth/register');   // 👈 חשוב!
console.log('   POST /api/auth/login');
console.log('   GET  /api/admin/config');
console.log('   PUT  /api/admin/config');
