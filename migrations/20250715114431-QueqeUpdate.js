'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('QueueUpdates', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      retrievalQueueId: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      estimatedTime: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('queued', 'processing', 'ready'),  
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
      broadcastTo: {
        type: Sequelize.ENUM('specific_user', 'all_tablets', 'all_connected'),  
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

    await queryInterface.bulkInsert('QueueUpdates', [
      {
        id: '1',
        retrievalQueueId: 'queue001',
        position: 1,
        estimatedTime: new Date('2025-07-15T08:00:00'),
        status: 'queued',
        message: 'The queue is processing your request.',
        timestamp: new Date(),
        broadcastTo: 'all_connected',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        retrievalQueueId: 'queue002',
        position: 2,
        estimatedTime: new Date('2025-07-15T09:00:00'),
        status: 'processing',
        message: 'Request is being processed.',
        timestamp: new Date(),
        broadcastTo: 'all_tablets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QueueUpdates');  
  }
};
