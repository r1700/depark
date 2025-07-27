import dotenv from 'dotenv';
import WebSocket from 'ws';

// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import itemsRoutes from './routes/items';
import { databaseService } from './services/database';

declare global {
  namespace Express {
    interface Application {
      server: any;
    }
  }
}

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/api/items', itemsRoutes);

// WebSocket Server
const wss = new WebSocket.Server({ noServer: true });

wss.on('connection', (ws) => {
  console.log('Client connected via WebSocket');

  ws.on('message', (message) => {
    console.log('Received message:', message);
    // Send a response back to the client
    ws.send('Hello from server');
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Main server listen and upgrade to handle WebSocket connections
app.server = app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  
  // Initialize database with sample data if using Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
    try {
      databaseService.canInitialize();
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

// Upgrade HTTP server to handle WebSocket connections
app.server.on('upgrade', (request:any, socket:any, head:any) => {
  wss.handleUpgrade(request, socket, head, (ws) => {
    wss.emit('connection', ws, request);
  });
});