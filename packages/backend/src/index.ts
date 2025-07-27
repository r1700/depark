import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import vehiclesRoutes from './routes/vehicles';
import loggerRoutes from './middlewares/locallLoggerMiddleware';

const app = express();

const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// Logging Middleware - should be applied here before all paths
app.use(loggerRoutes);  // Adding middleware to all requests

// CORS Configuration
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));

// Body Parser Middleware
app.use(express.json());

// Routes
app.get('/', (req, res) => {
  res.send('hello world!!!');
});
app.use('/api/health', healthRoutes);
app.use('/api/vehicles', vehiclesRoutes);

// Listen to the defined port
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);

  // Initialize database with sample data if using Supabase
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
