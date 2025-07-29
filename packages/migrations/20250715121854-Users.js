'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
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
      department: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      employee_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      google_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=pending, 2=approved, 3=declined, 4=suspended',
      },
      max_cars_allowed_parking: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      created_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      approved_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      approved_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.bulkInsert('users', [
      {
        baseuser_id: 1,
        department: 'Engineering',
        employee_id: 'E12345',
        google_id: 'google-id-12345',
        status: 2, 
        max_cars_allowed_parking: 2,
        created_by: 'admin',
        approved_by: 'admin',
        approved_at: new Date(),
      },
      {
        baseuser_id: 2,
        department: 'Sales',
        employee_id: 'E67890',
        google_id: 'google-id-67890',
        status: 1,
        max_cars_allowed_parking: 1,
        created_by: 'admin',
        approved_by: null,
        approved_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};