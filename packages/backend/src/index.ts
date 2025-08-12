import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import userRoutes from './routes/user.routes';
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
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}));
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(loggerRoutes);

app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('/api/health', healthRoutes);
app.use('/api', userRoutes); 
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/OAuth', googleAuth);
app.use('/api/auth', auth); 


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
  console.log('✅ PostgreSQL configured');
});