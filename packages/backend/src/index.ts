import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
// import loggerRoutes from './middlewares/locallLoggerMiddleware';
// import healthRoutes from './routes/health';
// import passwordRoutes from './routes/user.routes';
// import vehicleRoutes from './routes/vehicle';
// import exportToCSV from './routes/exportToCSV';
import googleAuth from './routes/google-auth';
import auth from './routes/auth';
import APIvehicle from './routes/APIvehicle';
const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
// Middleware setup
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
// app.use(loggerRoutes);
// app.use('/api/health', healthRoutes);
// app.use('/api/password', passwordRoutes);
// app.use('/api/vehicle', vehicleRoutes);
// app.use('/api/exportToCSV', exportToCSV);
app.use('/OAuth', googleAuth); // Ensure this route is correctly set up
app.use('/auth', auth);
app.use('/api/vehicles', APIvehicle); // Ensure this route is correctly set up
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
  console.log(`:rocket: Server running on port ${PORT}`);
  console.log(`:memo: Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`:globe_with_meridians: CORS enabled for: ${CORS_ORIGIN}`);
  console.log(':white_check_mark: Password reset API ready!');
  console.log(':link: Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
  console.log('   GET  /api/auth/users');     
  console.log('   POST /api/auth/register');  
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/admin/config');
  console.log('   PUT  /api/admin/config');
});