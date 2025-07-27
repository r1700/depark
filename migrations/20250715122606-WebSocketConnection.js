'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('WebSocketConnections', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      connectionType: {
        type: Sequelize.ENUM('mobile', 'tablet'),  
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,  
        allowNull: false,
        defaultValue: true,  
      },
      connectedAt: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      lastActivity: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,  
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

    await queryInterface.bulkInsert('WebSocketConnections', [
      {
        id: 'connection1',
        userId: 'user123',
        connectionType: 'mobile',
        isActive: true,
        connectedAt: new Date(),
        lastActivity: new Date(),
        ipAddress: '192.168.1.1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'connection2',
        userId: null,  
        connectionType: 'tablet',
        isActive: true,
        connectedAt: new Date(),
        lastActivity: new Date(),
        ipAddress: '192.168.1.2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('WebSocketConnections');
  }
};
