import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import itemsRoutes from './routes/items';
import vehicleRoutes from './routes/vehicle';


const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

app.use('/api/health', healthRoutes);
app.use('/api/items', itemsRoutes);
app.use('/api/vehicle', vehicleRoutes);

app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  
 
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
  
  } else {
    console.log('📝 Using mock data - Supabase not configured');
  }
});