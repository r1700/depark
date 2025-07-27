'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParkingSessions', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      vehicleId: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      licensePlate: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      surfaceSpot: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      undergroundSpot: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('parked', 'retrieval_requested', 'completed'),  
      },
      entryTime: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      exitTime: {
        type: Sequelize.DATE,  
        allowNull: true,
      },
      retrievalRequestTime: {
        type: Sequelize.DATE,  
        allowNull: true,
      },
      actualRetrievalTime: {
        type: Sequelize.DATE, 
        allowNull: true,
      },
      pickupSpot: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      requestedBy: {
        type: Sequelize.ENUM('mobile', 'tablet'),  
        allowNull: true,
      },
    });

    await queryInterface.bulkInsert('ParkingSessions', [
      {
        id: '1',
        userId: 'user123',
        vehicleId: 'vehicle1',
        licensePlate: 'ABC123',
        surfaceSpot: '5',
        undergroundSpot: null,
        status: 'parked',
        entryTime: new Date('2025-07-15T07:00:00'),
        exitTime: null,
        retrievalRequestTime: null,
        actualRetrievalTime: null,
        pickupSpot: null,
        requestedBy: null,
      },
      {
        id: '2',
        userId: 'user456',
        vehicleId: 'vehicle2',
        licensePlate: 'XYZ456',
        surfaceSpot: '2',
        undergroundSpot: null,
        status: 'retrieval_requested',
        entryTime: new Date('2025-07-15T08:30:00'),
        exitTime: null,
        retrievalRequestTime: new Date('2025-07-15T09:00:00'),
        actualRetrievalTime: null,
        pickupSpot: '6',
        requestedBy: 'mobile',
      },
    ]);
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParkingSessions');  
  }
};
