import { Client } from 'pg';
import dotenv from 'dotenv';

// Load the variables from the .env file
dotenv.config();

// שמור את הסיסמה למשתנה
const rawPassword = process.env.DB_PASSWORD;

if (typeof rawPassword !== 'string') {
  throw new Error('DB_PASSWORD is not a string!');
}

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "depark",
  password: rawPassword,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
});

// Connection to db
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

// Export the client instance for further use
export default client;
