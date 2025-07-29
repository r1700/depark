
import mysql, { Connection } from 'mysql2';
// connect
export const connection: Connection = mysql.createConnection({
  host: 'localhost',
  user: 'yourUsername',
  password: 'yourPassword',
  database: 'yourDatabase'
});

// connect to the database
connection.connect((err: mysql.QueryError | null) => {
  if (err) {
    console.error('Error connecting: ' + err.stack);
    return;
  }

// ✅ Here threadId is accessible with proper type
  console.log('Connected as id ' + connection.threadId);
});

