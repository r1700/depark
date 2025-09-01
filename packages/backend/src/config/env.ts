import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const STATUS = process.env.STATUS?.toLowerCase() || 'development';
console.log('Current STATUS:', STATUS);


interface DBVars {
  DB_USER: string;
  DB_PASSWORD: string;
  DB_HOST: string;
  DB_NAME: string;
  DB_DIALECT: 'postgres';
  DB_PORT: number;
}

let dbConfig: DBVars;

if (STATUS === 'production') {
  dbConfig = {
    DB_USER: process.env.PROD_DB_USER || 'postgres',
    DB_PASSWORD: process.env.PROD_DB_PASSWORD || 'postgres',
    DB_HOST: process.env.PROD_DB_HOST || 'db',
    DB_NAME: process.env.PROD_DB_NAME || 'postgres',
    DB_DIALECT: 'postgres',
    DB_PORT: Number(process.env.PROD_DB_PORT) || 5432,
  };
} else {
  dbConfig = {
    DB_USER: process.env.LOCAL_DB_USER || 'postgres',
    DB_PASSWORD: process.env.LOCAL_DB_PASSWORD || 'postgres',
    DB_HOST: process.env.LOCAL_DB_HOST || 'localhost',
    DB_NAME: process.env.LOCAL_DB_NAME || 'depark',
    DB_DIALECT: 'postgres',
    DB_PORT: Number(process.env.LOCAL_DB_PORT) || 5432,
  };
}

export default dbConfig;
