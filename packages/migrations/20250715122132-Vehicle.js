'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehicles', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
     baseuser_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      license_plate: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      vehicle_model_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      color: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      is_currently_parked: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      added_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=user, 2=hr',
      },
      dimension_overrides: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      dimensions_source: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=model_reference, 2=manual_override, 3=government_db',
      },
    });

    await queryInterface.bulkInsert('vehicles', [
      {
        baseuser_id: 1,
        license_plate: 'ABC123',
        vehicle_model_id: 1,
        color: 'Red',
        is_active: true,
        is_currently_parked: false,
        created_at: new Date(),
        updated_at: new Date(),
        added_by: 1, 
        dimension_overrides: null,
        dimensions_source: 1, 
      },
      {
        baseuser_id: 2,
        license_plate: 'DEF456',
        vehicle_model_id: 2,
        color: 'Blue',
        is_active: true,
        is_currently_parked: true,
        created_at: new Date(),
        updated_at: new Date(),
        added_by: 2, 
        dimension_overrides: null,
        dimensions_source: 2, 
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehicles');
  }
};