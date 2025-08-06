import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
// import vehicleRoutes from './routes/vehicle';
import RetrievalQueue from './model/database-models/retrievalQueue.model';  // ייבוא המודל של RetrievalQueue

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
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
// app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);

app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/retrievalqueues', async (req, res) => {
  try {
    const allQueues = await RetrievalQueue.findAll();  // שליפה של כל הרשומות
    console.log({allQueues});
    
    res.json(allQueues);  // מחזיר את הרשומות כ-JSON
  } catch (error) {
    console.log({error});
    
    console.error('Error retrieving queues:', error);
    res.status(500).json({ message: 'Failed to retrieve queues' });  // מחזיר שגיאה אם לא הצלחנו לשלוף את הנתונים
  }
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
});