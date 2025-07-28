import path from 'path';
require('dotenv').config();

const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env || 'development';


export default {
  development: {
    username: DATA_USERNAME || 'postgres',
    password: PASSWORD || '9181',
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