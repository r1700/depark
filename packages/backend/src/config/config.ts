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
  migrationStorageTableName: 'sequelize_meta',
  dialectOptions: {
    ssl: { require: true, rejectUnauthorized: false }
  },
  migrations: {
    path: path.resolve(__dirname, '../../migrations'),
    pattern: /\.(js|ts)$/,
  },
};
