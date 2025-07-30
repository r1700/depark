'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehiclereports', {
      id: {
        type: Sequelize.INTEGER,  
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      total_vehicles: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      active_vehicles: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      unknown_models: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      dimension_sources: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      top_makes: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      generated_by: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      generated_at: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('vehiclereports', [
      {
        total_vehicles: 500,
        active_vehicles: 400,
        unknown_models: 50,
        dimension_sources: JSON.stringify({ manual: 100, government_db: 200, model_default: 50 }),
        top_makes: JSON.stringify([{ make: 'Toyota', count: 100 }, { make: 'Honda', count: 80 }]),
        generated_by: 'admin',
        generated_at: new Date(),
      },
      {
        total_vehicles: 450,
        active_vehicles: 350,
        unknown_models: 30,
        dimension_sources: JSON.stringify({ manual: 120, government_db: 150, model_default: 40 }),
        top_makes: JSON.stringify([{ make: 'Ford', count: 90 }, { make: 'BMW', count: 60 }]),
        generated_by: 'admin',
        generated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehiclereports');
  }
};
