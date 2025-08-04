
import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

const sequelize = new Sequelize(
  process.env.DATABASE || '',
  process.env.DATA_USERNAME || '',
  process.env.PASSWORD || '',
  {
    host: process.env.HOST || 'localhost',
    dialect: 'postgres',
    port: process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432,
    logging: false, 
  }
);

export default sequelize;