'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('unknownvehiclemodels', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      make: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      request_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      last_requested: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=pending_review, 2=resolved, 3=ignored',
      },
      resolved_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      resolved_vehicle_model_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('unknownvehiclemodels', [
      {
        make: 'Toyota',
        model: 'Corolla',
        request_count: 3,
        last_requested: new Date(),
        status: 1, 
        created_at: new Date(),
      },
      {
        make: 'Honda',
        model: 'Civic',
        request_count: 5,
        last_requested: new Date(),
        status: 2, 
        resolved_by: 'admin1',
        resolved_at: new Date(),
        resolved_vehicle_model_id: 'H123',
        created_at: new Date(),
      },
      {
        make: 'Ford',
        model: 'Focus',
        request_count: 2,
        last_requested: new Date(),
        status: 3, 
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('unknownvehiclemodels');
  }
};