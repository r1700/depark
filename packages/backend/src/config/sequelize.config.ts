import path from 'path';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') }); // עדכני את הנתיב לפי הצורך
const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env || 'development';
console.log("DATA_USERNAME, PASSWORD, HOST, DATABASE:", { DATA_USERNAME, PASSWORD, HOST, DATABASE });


export const thisSequelize = new Sequelize(

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
