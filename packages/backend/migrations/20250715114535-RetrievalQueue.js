'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('RetrievalQueues', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      licensePlate: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      undergroundSpot: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      requestedAt: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      estimatedTime: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('queued', 'processing', 'ready', 'completed'),  
        allowNull: false,
      },
      assignedPickupSpot: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      requestSource: {
        type: Sequelize.ENUM('mobile', 'tablet'),  
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

    await queryInterface.bulkInsert('RetrievalQueues', [
      {
        id: '1',
        sessionId: 'session123',
        userId: 'user001',
        licensePlate: 'ABC123',
        undergroundSpot: 'B1',
        requestedAt: new Date('2025-07-15T08:00:00'),
        estimatedTime: new Date('2025-07-15T08:15:00'),
        position: 1,
        status: 'queued',
        assignedPickupSpot: 'A1',
        requestSource: 'mobile',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        sessionId: 'session124',
        userId: 'user002',
        licensePlate: 'XYZ456',
        undergroundSpot: 'B2',
        requestedAt: new Date('2025-07-15T08:30:00'),
        estimatedTime: new Date('2025-07-15T08:45:00'),
        position: 2,
        status: 'processing',
        assignedPickupSpot: 'A2',
        requestSource: 'tablet',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RetrievalQueues');  
  }
};
