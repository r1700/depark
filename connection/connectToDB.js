const { Client } = require('pg');  // יש להגדיר את ה-Client רק פעם אחת

// פונקציה לחיבור למסד הנתונים
const connectToDB = async () => {
  const client = new Client({
    user: 'postgres',          
    host: 'localhost',         
    database: 'depark', 
    password: 's0527664299!', 
    port: 5432,               
  });

  try {
    await client.connect();  // חיבור למסד הנתונים
    console.log('Connected to PostgreSQL!');

    const res = await client.query('SELECT * FROM BaseUsers');
    console.log('Query results:', res.rows);
  } catch (err) {
    console.error('Connection error', err.stack);
  } finally {
    client.end();
  }
};
connectToDB();
