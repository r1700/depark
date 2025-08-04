import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { User } from './User';


export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 54322,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'postgres',
  models: [User], 
  logging: false,
});

console.log('Models:', sequelize.modelManager.all.map(m => m.name));

sequelize.sync();
