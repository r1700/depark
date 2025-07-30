import { Sequelize } from 'sequelize';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // טען משתני סביבה מה-.env

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