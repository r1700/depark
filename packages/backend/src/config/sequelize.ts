import { Sequelize } from 'sequelize';
import { appDbConfig } from './config';
const sequelize = new Sequelize(
  appDbConfig.database,
  appDbConfig.username,
  appDbConfig.password,
  {
    host: appDbConfig.host,
    port: appDbConfig.port,  
    dialect: appDbConfig.dialect,
    dialectOptions: process.env.STATUS === 'production' ? appDbConfig.dialectOptions : undefined,
    logging: process.env.STATUS === 'development' ? console.log : false,
  }
);

export default sequelize;
