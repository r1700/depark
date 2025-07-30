import { Sequelize } from 'sequelize';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
console.log('DB password:', process.env.PASSWORD);

export const sequelize = new Sequelize(
  process.env.DATABASE || '',
  process.env.DATA_USERNAME || '',
  process.env.PASSWORD || '',
  {
    host: process.env.HOST,
    port: Number(process.env.DB_PORT) || 5432,
    dialect: 'postgres',
    logging: false,
  }
);