'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('systemhealths', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      component: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=opc_bridge, 2=api_server, 3=database, 4=websocket_server, 5=government_sync',
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=healthy, 2=warning, 3=error',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      metrics: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });

  await queryInterface.bulkInsert('systemhealths', [
  {
    component: 2, 
    status: 1, 
    message: 'API server is running smoothly.',
    metrics: JSON.stringify({
      memoryUsage: 50,
      responseTime: 200,
    }),
    timestamp: new Date(),
 
  },
  {
    component: 4, 
    status: 2, 
    message: 'WebSocket server is experiencing high latency.',
    metrics: JSON.stringify({
      memoryUsage: 70,
      responseTime: 500,
    }),
    timestamp: new Date(),
    
  },
  {
    component: 3, 
    status: 3,
    message: 'Database connection failed.',
    metrics: JSON.stringify({
      memoryUsage: 90,
      responseTime: 1000,
    }),
    timestamp: new Date(),
   
  },
]);
  }
, 

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('systemhealths');
  }
};