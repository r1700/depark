// config/config.ts
import path from 'path';
import dbConfig from './env';

export const appDbConfig = {
  username: dbConfig.DB_USER,
  password: dbConfig.DB_PASSWORD,
  database: dbConfig.DB_NAME,
  host: dbConfig.DB_HOST,
  port: dbConfig.DB_PORT,
  dialect: dbConfig.DB_DIALECT,
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  migrationStorageTableName: 'sequelize_meta',
  migrations: {
    path: path.resolve(__dirname, '../../migrations'),
    pattern: /\.(js|ts)$/,
  },
};