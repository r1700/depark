import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from the root .env file

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