import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../.env') }); // Load environment variables from the root .env file

const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME }: any = process.env;


export default {
  development: {
    username: DB_USER,
    password: DB_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrations: {
      path: path.resolve(__dirname, '../../../migrations'),
      pattern: /\.js|ts$/
    }
  }
}
