// config/sequelize.ts
import { Sequelize } from 'sequelize';
import { appDbConfig } from './config';
console.log({ appDbConfig });

const sequelize = new Sequelize(
  appDbConfig.database,
  appDbConfig.username,
  appDbConfig.password,
  {
    host: appDbConfig.host,
    dialect: appDbConfig.dialect,
    dialectOptions: process.env.STATUS === 'production' ? appDbConfig.dialectOptions : undefined,
    logging: process.env.STATUS === 'development' ? console.log : false,
  }
);

export default sequelize;