'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParkingConfigurations', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      facilityName: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      totalSurfaceSpots: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      surfaceSpotIds: {
        type: Sequelize.ARRAY(Sequelize.STRING),  
        allowNull: false,
      },
      avgRetrievalTimeMinutes: {
        type: Sequelize.INTEGER,  
        defaultValue: 1,
        allowNull: false,
      },
      maxQueueSize: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      operatingHours: {
        type: Sequelize.JSON,  
        allowNull: false,
      },
      timezone: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedBy: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('ParkingConfigurations', [
      {
        id: '1',
        facilityName: 'Central Parking Lot',
        totalSurfaceSpots: 50,
        surfaceSpotIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avgRetrievalTimeMinutes: 5,
        maxQueueSize: 10,
        operatingHours: JSON.stringify({ start: '07:00', end: '19:00' }),  
        timezone: 'Asia/Jerusalem',
        updatedAt: new Date(),
        updatedBy: 'admin123',
      },
      {
        id: '2',
        facilityName: 'North Parking Garage',
        totalSurfaceSpots: 30,
        surfaceSpotIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avgRetrievalTimeMinutes: 3,
        maxQueueSize: 5,
        operatingHours: JSON.stringify({ start: '08:00', end: '20:00' }),  
        timezone: 'Asia/Jerusalem',
        updatedAt: new Date(),
        updatedBy: 'admin456',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParkingConfigurations');
  }
};
