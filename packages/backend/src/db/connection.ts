import { Client } from 'pg';
import dotenv from 'dotenv';

// Load the variables from the .env file
dotenv.config();

// Create a client object to connect to the database
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: Number(process.env.DB_PORT),
});

// Connection to db
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

export default client