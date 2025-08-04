import 'reflect-metadata';
import { Sequelize } from 'sequelize-typescript';
import { User } from './User';

export const sequelize = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 54322,
  database: process.env.DB_NAME || 'postgres',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  logging: false,
  models: [User], 
});


console.log('🔍 Registered models:', sequelize.modelManager.all.map(m => m.name));

sequelize.sync();
