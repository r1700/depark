import { Client } from 'pg'; // חיבור למסד הנתונים
import dotenv from 'dotenv';

dotenv.config();

const client = new Client({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_DATABASE || "depark",
  password: process.env.DB_PASSWORD || "1333",
  port:process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432
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

// פונקציה לחיפוש תפקיד של משתמש לפי id
const getRole = async (id:string) => {
  try {
    const result = await client.query(`SELECT * FROM "AdminUsers" WHERE id = $1`, [id]);
    console.log("Role result:", result.rows[0].role);
    
    return result.rows[0] // מחזיר את כל המידע של המשתמש
  } catch (err) {
    console.error('Query error', err);
  }
};

export { getId, getRole };
