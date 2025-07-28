import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import vehicleRoutes from './routes/vehicle';


const app = express();
const PORT = process.env.PORT || 3001; // הוסף ברירת מחדל
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000'; // הוסף ברירת מחדל

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/vehicle', vehicleRoutes);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  
 
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
<<<<<<< HEAD
    } else {
=======
    
  } else {
>>>>>>> 5d54def5 (add)
    console.log('📝 Using mock data - Supabase not configured');
  }
});

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DePark Backend is running!' });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

console.log('🔗 Available routes:');
console.log('   GET  /');
console.log('   GET  /health');
console.log('   GET  /api/auth/users');      // 👈 חשוב!
console.log('   POST /api/auth/register');   // 👈 חשוב!
console.log('   POST /api/auth/login');
console.log('   GET  /api/admin/config');
console.log('   PUT  /api/admin/config');

