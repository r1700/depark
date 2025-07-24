import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import { databaseService } from './services/database';

// Initialize Express app
const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Sample data for chart
const chartData = {
  "data": [
    {
      "SpaceId": 1,
      "Occupied Hours": 7,
      "Entries": 10,
      "Exits": 12
    },
    {
      "SpaceId": 2,
      "Occupied Hours": 6,
      "Entries": 13,
      "Exits": 9
    },
    {
      "SpaceId": 3,
      "Occupied Hours": 3,
      "Entries": 10,
      "Exits": 12
    },
    {
      "SpaceId": 4,
      "Occupied Hours": 6,
      "Entries": 13,
      "Exits": 9
    },
    {
      "SpaceId": 5,
      "Occupied Hours": 2,
      "Entries": 10,
      "Exits": 12
    },
    {
      "SpaceId": 6,
      "Occupied Hours": 8,
      "Entries": 13,
      "Exits": 9
    },
    {
      "SpaceId": 7,
      "Occupied Hours": 10,
      "Entries": 10,
      "Exits": 12
    },
    {
      "SpaceId": 8,
      "Occupied Hours": 4,
      "Entries": 13,
      "Exits": 9
    },
    {
      "SpaceId": 9,
      "Occupied Hours": 7,
      "Entries": 10,
      "Exits": 12
    },
    {
      "SpaceId": 10,
      "Occupied Hours": 5,
      "Entries": 13,
      "Exits": 9
    }
  ]
};

// Routes
app.use('/api/health', healthRoutes);

// Route to fetch chart data
app.get('/api/data', (req, res) => {
  res.json(chartData);  // Return the chart data as JSON
});

// Start the server
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
});
