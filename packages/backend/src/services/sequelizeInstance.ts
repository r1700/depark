import { Sequelize } from 'sequelize';

const sequelize = new Sequelize('depark', 'postgres', '123', {
  host: 'localhost',
  dialect: 'postgres', 
});


export default sequelize;
