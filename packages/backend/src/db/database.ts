import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE || '',       // database name
  process.env.USER || '',           // username
  process.env.PASSWORD || '',       // password
  {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres',
    logging: false, // כבה לוגים, אפשר להדליק בעת פיתוח: console.log
  }
);

export default sequelize;