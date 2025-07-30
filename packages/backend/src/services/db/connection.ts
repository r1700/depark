import { Client } from 'pg';
import dotenv from 'dotenv';
// Load the variables from the .env file
dotenv.config();
// Create a client object to connect to the database
const client = new Client({
 user: "postgres",
  host: "localhost",
  database: "depark",
  password: "pnini",
  port: 5432
});
// Connection to db 
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));
export default client
