
require('dotenv').config();
const path = require('path');

module.exports = {
  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    logging: false
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    logging: false
  },
  production: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD ,
    database: process.env.DB_NAME ,
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    logging: false
  }
};
