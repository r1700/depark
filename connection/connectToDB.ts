


import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'depark',
  password: 's0527664299!',
  port: 5432,
});

export default pool;
