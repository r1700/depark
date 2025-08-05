import path from 'path';
require('dotenv').config();

const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env;

module.exports = {
  development: {
    username: DATA_USERNAME || 'postgres',
    password: PASSWORD || '1234',
    database: DATABASE || 'depark',
    host: HOST || 'localhost',
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrations: {
      path: path.resolve(__dirname, '../../../migrations'), 
      pattern: /\.js|ts$/
    }
  },
  test: {
    username: DATA_USERNAME || 'postgres',
    password: PASSWORD || '1234',
    database: DATABASE || 'depark_test',
    host: HOST || 'localhost',
    dialect: 'postgres'
  },
  production: {
    username: DATA_USERNAME || 'postgres',
    password: PASSWORD || '1234',
    database: DATABASE || 'depark_production',
    host: HOST || 'localhost',
    dialect: 'postgres'
  }
};

export default {
  development: {
    username: DATA_USERNAME || 'postgres',
    password: PASSWORD || '1234',
    database: DATABASE || 'depark',
    host: HOST || 'localhost',
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrations: {
      path: path.resolve(__dirname, '../../../migrations'), 
      pattern: /\.js|ts$/
    }
  }
};