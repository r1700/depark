import { Client } from 'pg'; // חיבור למסד הנתונים
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: "postgres",
  host: "localhost",
  database: "depark",
  password: "pnini",
  port: 5432
});

client.connect();

// פונקציה לחיפוש id על פי אימייל
const getId = async (email:string) => {
  try {
    const result = await client.query(`SELECT id FROM "BaseUser" WHERE email = $1`, [email]);
    console.log(result.rows[0],"rows");
    
    return result.rows[0]?.id;  // אם לא מצא, יחזור undefined
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
