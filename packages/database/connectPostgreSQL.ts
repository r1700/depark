import express, { Request, Response } from 'express';
import { Client } from 'pg';

const app = express();
const port = 3000;


const client = new Client({
  user: 'postgres',  
  host: 'localhost',
  database: 'postgres',  
  password: '8440',    
  port: 5432,           
});

client.connect()
  .then(() => console.log('Connected to PostgreSQL'))
  .catch((err) => console.error('Connection error', err.stack));

  app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
