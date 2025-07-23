'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Vehicles', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      licensePlate: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vehicleModelId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      isCurrentlyParked: {
        type: Sequelize.BOOLEAN,
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
      addedBy: {
        type: Sequelize.ENUM('user', 'hr'),
        allowNull: false,
      },
      ParkingSessionId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      dimensionOverrides: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      dimensionsSource: {
        type: Sequelize.ENUM('model_reference', 'manual_override', 'government_db'),
        allowNull: false,
      }
    });

    await queryInterface.bulkInsert('Vehicles', [
      {
        id: 'vehicle1',
        userId: 'user1',
        licensePlate: 'ABC123',
        vehicleModelId: 'model1',
        color: 'Red',
        isActive: true,
        isCurrentlyParked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: 'user',
        ParkingSessionId: 'session1',
        dimensionOverrides: null,
        dimensionsSource: 'model_reference',
      },
      {
        id: 'vehicle2',
        userId: 'user2',
        licensePlate: 'DEF456',
        vehicleModelId: 'model2',
        color: 'Blue',
        isActive: true,
        isCurrentlyParked: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        addedBy: 'hr',
        ParkingSessionId: 'session2',
        dimensionOverrides: null,
        dimensionsSource: 'manual_override',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Vehicles');
  }
};
