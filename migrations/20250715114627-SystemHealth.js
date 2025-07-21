'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SystemHealths', {
      id: {
        type: Sequelize.STRING, 
        primaryKey: true,
        allowNull: false,
      },
      component: {
        type: Sequelize.ENUM('opc_bridge', 'api_server', 'database', 'websocket_server', 'government_sync'),  
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('healthy', 'warning', 'error'),  
        allowNull: false,
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('SystemHealths', [
      {
        id: '1',
        component: 'api_server',
        status: 'healthy',
        message: 'API server is running smoothly.',
        metrics: JSON.stringify({
          memoryUsage: 50,
          responseTime: 200,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        component: 'websocket_server',
        status: 'warning',
        message: 'WebSocket server is experiencing high latency.',
        metrics: JSON.stringify({
          memoryUsage: 70,
          responseTime: 500,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        component: 'database',
        status: 'error',
        message: 'Database connection failed.',
        metrics: JSON.stringify({
          memoryUsage: 90,
          responseTime: 1000,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SystemHealths');  
  }
};
