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
<<<<<<< HEAD
import adminConfigRouter from './routes/adminConfig';
import googleAuth from './routes/google-auth';
import auth from './routes/auth';
=======
import authRoutes from './routes/auth';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
>>>>>>> a04ffab5d221decfd86480c13a5d5761d38a2c53

const app = express();
const PORT = process.env.PORT || 3001;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
<<<<<<< HEAD
// Middleware setup
=======
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;



>>>>>>> a04ffab5d221decfd86480c13a5d5761d38a2c53
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true,
}));
app.use(express.json());
<<<<<<< HEAD
=======

if (!GOOGLE_CLIENT_ID) {
  throw new Error('Missing GOOGLE_CLIENT_ID');
}

app.use(cors({ origin: CORS_ORIGIN, credentials: true }));
app.use(express.json());
>>>>>>> a04ffab5d221decfd86480c13a5d5761d38a2c53
app.use(loggerRoutes);
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
<<<<<<< HEAD
app.use('/api/admin', adminConfigRouter); // Add admin routes
app.use('/OAuth', googleAuth); // Ensure this route is correctly set up
app.use('/auth', auth);
=======
// app.use('/api/users', userFilter);
app.use('/api/auth', authRoutes);
app.use('/api/auth', userGoogleAuthRoutes);

app.use((req, res, next) => {
  console.log(`[${req.method}] ${req.path}`, req.body);
  next();
});


>>>>>>> a04ffab5d221decfd86480c13a5d5761d38a2c53
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
  console.log(`:memo: Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`:globe_with_meridians: CORS enabled for: ${CORS_ORIGIN}`);
  console.log(':white_check_mark: Password reset API ready!');
  console.log(':link: Available routes:');
  console.log('   GET  /');
  console.log('   GET  /health');
<<<<<<< HEAD
  console.log('   GET  /api/auth/users');      // Important!
  console.log('   POST /api/auth/register');   // Important!
  console.log('   GET  /api/auth/users');      // :point_left: חשוב!
  console.log('   POST /api/auth/register');   // :point_left: חשוב!
=======
  console.log('   GET  /api/auth/users');
  console.log('   POST /api/auth/register');
>>>>>>> a04ffab5d221decfd86480c13a5d5761d38a2c53
  console.log('   POST /api/auth/login');
  console.log('   GET  /api/admin/config');
  console.log('   PUT  /api/admin/config');

  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log(':file_cabinet: Initializing database...');
  } else {
    console.log(':memo: Using mock data - Supabase not configured');
  }
});
