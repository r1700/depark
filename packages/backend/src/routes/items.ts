import { Router } from 'express';
import { databaseService } from '../services/database';

const router = Router();

// Fallback mock data (used if database is not available)

// Determine if we should use database or mock data
const useDatabase = !!(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);

// GET /api/items - Get all items
router.get('/', async (req, res) => {
  try {
   
    
    
   
    
    
    // Fallback to mock data if database fails
  }catch (error) {
    console.error('Error fetching items:', error);
  }

// GET /api/items/:id - Get specific item
})


