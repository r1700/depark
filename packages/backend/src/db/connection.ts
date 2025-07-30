import { Client } from 'pg';
import dotenv from 'dotenv';

// Load the variables from the .env file
dotenv.config();

// Create a client object to connect to the database
const client = new Client({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: Number(process.env.PG_PORT),
});

// Connection to db
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

export default client