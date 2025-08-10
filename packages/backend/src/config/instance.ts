import { Sequelize } from 'sequelize';
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME }: any = process.env || 'development';
const sequelize = new Sequelize(
    DB_NAME , // Database name
    DB_USER , // Username
    DB_PASSWORD , // Password
    {
        host: DB_HOST , // Server address
        dialect: 'postgres', // Database type
        logging: false, // Disable SQL logging
    }
);
export default sequelize;