import { Client } from 'pg';
import dotenv from 'dotenv';
// Load the variables from the .env file
dotenv.config();
// Create a client object to connect to the database
const client = new Client({
user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "depark",
  password: process.env.DB_PASSWORD || "1333",
  port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
});
// Connection to db 
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));
export default client
