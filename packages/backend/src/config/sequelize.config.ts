import path from 'path';
require('dotenv').config();

const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env;


export default {
  development: {
    username: DATA_USERNAME ,
    password: PASSWORD ,
    database: DATABASE,
    host: HOST,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrations: {
      path: path.resolve(__dirname, '../../../migrations'), 
      pattern: /\.js|ts$/
    }
  }
};