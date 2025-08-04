import { Client } from 'pg'; 
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "depark",
  password: process.env.DB_PASSWORD || "s0527664299!",
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
});

client.connect().then(() => {
  console.log('Connected to Postgres database');
}).catch(err => {
  console.error('Failed to connect to Postgres database:', err);
});


const getId = async (email: string) => {
  try {
    const result = await client.query(`SELECT id FROM "baseuser" WHERE email = $1`, [email]);
    console.log(result.rows[0], "rows");
    return result.rows[0]?.id;  
  } catch (err) {
    console.error('Query error', err);
    throw err; 
  }
};

async function getRole(id: string) {
  try {
    const result = await client.query('SELECT * FROM adminusers WHERE id = $1', [id]);
    if (result.rows.length > 0) {
      return result.rows[0];  
    } else {
      return null;  
    }
  } catch (err) {
    console.error('Query error', err);
    throw err;
  }
}

export const db = {
  query: (text: string, params?: any[]) => client.query(text, params),
};

export { getId, getRole };