import { Pool } from 'pg';
import dotenv from 'dotenv';
dotenv.config();
const pool = new Pool({
  user: process.env.DATA_USERNAME,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  database: process.env.DATABASE,
  port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
});
export default pool;