import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import authRouter from './routes/auth';
import healthRoutes from './routes/health';
import protectedRouter from './routes/protected';   // <-- ייבוא ראוטר מוגן

const app = express();
const PORT = process.env.PORT || 3000;           // הגדר ברירת מחדל
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*'; // ברירת מחדל פתוחה

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Public routes (ללא אימות)
app.use('/api/auth', authRouter);
app.use('/api/health', healthRoutes);

// Protected routes (דורשים JWT)
app.use('/api/protected', protectedRouter);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
    try {
      // databaseService.canInitialize();
      try {
        // await databaseService.initializeSampleData();
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

export default app;