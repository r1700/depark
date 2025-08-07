import { Client } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const rawPassword = process.env.DB_PASSWORD;
if (typeof rawPassword !== 'string') {
  throw new Error('DB_PASSWORD must be a string!');
}

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "depark",
  password: rawPassword,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

export default client;
