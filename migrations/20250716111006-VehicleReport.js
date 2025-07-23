'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VehicleReports', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      totalVehicles: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      activeVehicles: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      unknownModels: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      dimensionSources: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      topMakes: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      generatedBy: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      generatedAt: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('VehicleReports', [
      {
        id: '1',
        totalVehicles: 500,
        activeVehicles: 400,
        unknownModels: 50,
        dimensionSources: JSON.stringify({ manual: 100, government_db: 200, model_default: 50 }),
        topMakes: JSON.stringify([{ make: 'Toyota', count: 100 }, { make: 'Honda', count: 80 }]),
        generatedBy: 'admin',
        generatedAt: new Date(),
      },
      {
        id: '2',
        totalVehicles: 450,
        activeVehicles: 350,
        unknownModels: 30,
        dimensionSources: JSON.stringify({ manual: 120, government_db: 150, model_default: 40 }),
        topMakes: JSON.stringify([{ make: 'Ford', count: 90 }, { make: 'BMW', count: 60 }]),
        generatedBy: 'admin',
        generatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VehicleReports');
  }
};
