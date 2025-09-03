import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE || '',      
  process.env.USER || '',           
  process.env.PASSWORD || '',       
  {
    host: process.env.HOST || 'localhost',
    port: Number(process.env.PG_PORT) || 5432,
    dialect: 'postgres',
    logging: false, 
  }
);

export default sequelize;