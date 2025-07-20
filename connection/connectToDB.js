const { Client } = require('pg');  // יש להגדיר את ה-Client רק פעם אחת

// פונקציה לחיבור למסד הנתונים
const connectToDB = async () => {
  const client = new Client({
    user: 'postgres',          // שם המשתמש שלך
    host: 'localhost',         // כתובת השרת
    database: 'depark', // שם בסיס הנתונים שלך
    password: 's0527664299!', // סיסמת המשתמש שלך
    port: 5432,                // פורט ברירת המחדל של PostgreSQL
  });

  try {
    await client.connect();  // חיבור למסד הנתונים
    console.log('Connected to PostgreSQL!');

    // ביצוע שאילתת SELECT
    const res = await client.query('SELECT * FROM BaseUsers');
    console.log('Query results:', res.rows);
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    // סיום החיבור למסד הנתונים
    client.end();
  }
};
connectToDB();
