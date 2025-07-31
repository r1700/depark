import { Client } from 'pg'; 
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER ,
  host: process.env.DB_HOST ,
  database: process.env.DB_DATABASE ,
  password: process.env.DB_PASSWORD ,
  port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
});

client.connect();

const getId = async (email:string) => {
  try {
    const result = await client.query(`SELECT id FROM "BaseUser" WHERE email = $1`, [email]);
    console.log(result.rows[0],"rows");
    
    return result.rows[0]?.id;  
  } catch (err) {
    console.error('Query error', err);
  }
};

const getRole = async (id:string) => {
  try {
    const result = await client.query(`SELECT * FROM "AdminUsers" WHERE id = $1`, [id]);
    console.log("Role result:", result.rows[0].role);
    
    return result.rows[0] 
  } catch (err) {
    console.error('Query error', err);
  }
};

export { getId, getRole };
