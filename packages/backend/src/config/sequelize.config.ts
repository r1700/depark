import path from 'path';

console.log('sequelize.config.ts is running...');
console.log(path.resolve(__dirname, '../../../migrations'));



// Configuration for Sequelize ORM
export default {
  development: {
    username: 'postgres',
    password: 'Leah#31529',
    database: 'depark',
    host: 'localhost',
    dialect: 'postgres',
    migrationStorageTableName: 'sequelize_meta',
    migrations: {
      path: path.resolve(__dirname, '../../../migrations'), // ודא הנתיב נכון
      pattern: /\.js|ts$/
    }
  }
};