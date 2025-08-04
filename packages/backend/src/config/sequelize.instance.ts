import { Sequelize } from 'sequelize';
require('dotenv').config();

const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env || 'development';

const sequelize = new Sequelize(
    DATABASE || 'depark', // Database name
    DATA_USERNAME || 'postgres', // Username
    PASSWORD || '1333', // Password
    {
        host: HOST || 'localhost', // Server address
        dialect: 'postgres', // Database type
        logging: false, // Disable SQL logging
    }
);

export default sequelize;