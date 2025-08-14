import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE || '',
  process.env.USER  || '',
  process.env.PASSWORD || '',
  {
    host: process.env.HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.PG_PORT ? parseInt(process.env.PG_PORT, 10) : 5432,
    logging: false, 
  }
);

export default sequelize;