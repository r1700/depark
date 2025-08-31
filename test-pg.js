const { Client } = require('pg');
const client = new Client({
user: 'postgres',
host: 'localhost',
database: 'postgres',
password: 'zdnm3278',
port: 5432,
});
client.connect()
.then(() => console.log('connected OK'))
.catch(err => console.error('connect error:', err))
.finally(() => client.end());