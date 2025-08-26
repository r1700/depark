import { Client } from 'pg';
import * as dotenv from 'dotenv';
dotenv.config();
const client = new Client({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_DATABASE || 'Depark',
  password: process.env.DB_PASSWORD || '1333',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
});
client.connect();
const getId = async (email: string) => {
  try {
    const result = await client.query(
      `SELECT id FROM baseuser WHERE email = $1`,
      [email]
    );
    return result.rows[0]?.id;
  } catch (err) {
    console.error('Query error in getId:', err);
  }
};
const getRole = async (id: string) => {
  try {
    const result = await client.query(
      `
      SELECT
        a.role,
        a.permissions,
        a.password_hash,
        b.first_name,
        b.last_name,
        b.email,
        b.id
      FROM adminusers a
      JOIN baseuser b ON a.baseuser_id = b.id
      WHERE a.baseuser_id = $1
      `,
      [id]
    );
    return result.rows[0];
  } catch (err) {
    console.error('Query error in getRole:', err);
  }
};
export { getId, getRole };
