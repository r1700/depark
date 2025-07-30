import { Client } from 'pg';
import dotenv from 'dotenv';
// Load the variables from the .env file
dotenv.config();
// Create a client object to connect to the database
const client = new Client({
 user: "postgres",
  host: "localhost",
  database: "depark",
  password: "1234",
  port: 5432
});
// Connection to db 
client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err: unknown) => {
    if (err instanceof Error) {
      console.error('Connection error', err.stack);
    } else {
      console.error('Connection error', err);
    }
  });
export default client
