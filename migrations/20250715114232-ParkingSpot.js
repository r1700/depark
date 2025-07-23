'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParkingSpots', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('surface', 'underground'),  
        allowNull: false,
      },
      spotNumber: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      isOccupied: {
        type: Sequelize.BOOLEAN,  
        allowNull: false,
        defaultValue: false,  
      },
      currentVehicleId: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      lastUpdated: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('ParkingSpots', [
      {
        id: '1',
        type: 'surface',
        spotNumber: 'A1',
        isOccupied: false,
        currentVehicleId: null,
        lastUpdated: new Date(),
      },
      {
        id: '2',
        type: 'surface',
        spotNumber: 'A2',
        isOccupied: true,
        currentVehicleId: 'vehicle123',
        lastUpdated: new Date(),
      },
      {
        id: '3',
        type: 'underground',
        spotNumber: 'B1',
        isOccupied: false,
        currentVehicleId: null,
        lastUpdated: new Date(),
      },
      {
        id: '4',
        type: 'underground',
        spotNumber: 'B2',
        isOccupied: true,
        currentVehicleId: 'vehicle456',
        lastUpdated: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParkingSpots');
  }
};
