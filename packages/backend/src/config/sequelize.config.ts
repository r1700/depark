// import path from 'path';
// import dotenv from 'dotenv';
// dotenv.config({ path: path.resolve(__dirname, '../../../.env') }); // Load environment variables from the root .env file

// const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME }: any = process.env;

// // const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env;

// export default  {
//   development: {
//     username: DB_USER ,
//     password: DB_PASSWORD ,
//     database: DB_NAME ,
//     host: DB_HOST ,
//     dialect: 'postgres',
//     migrationStorageTableName: 'sequelize_meta',
//     migrations: {
//       path: path.resolve(__dirname, '../../../migrations'),
//       pattern: /\.js|ts$/
//     }
//   }
// };


import path from 'path';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
// const { DATA_USERNAME, PASSWORD, HOST, DATABASE }: any = process.env;
const { DB_USER, DB_PASSWORD, DB_HOST, DB_NAME }: any = process.env;

// console.log(process.env);
// console.log('Password:', PASSWORD);
export const sequelize = new Sequelize(
  DB_NAME || '',
  DB_USER || 'postgres',
  DB_PASSWORD || '1234',
  {
    host: DB_HOST || 'localhost',
    dialect: 'postgres',
    // migrationStorageTableName: 'sequelize_meta',
    // migrations: {
    //   path: path.resolve(__dirname, '../../../migrations'),
    //   pattern: /\.js|ts$/
    // }
  }
);
