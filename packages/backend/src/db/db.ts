import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();


export const pool = new Pool({
  connectionString: process.env.SUPABASE_FULL_URL || process.env.DATABASE_URL,
});

