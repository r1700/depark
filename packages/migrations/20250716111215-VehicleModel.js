'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('vehiclemodels', {
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
      year_range: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      dimensions: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      source: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=manual, 2=government_db, 3=hr_input',
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
      updated_by: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

   await queryInterface.bulkInsert('vehiclemodels', [
  {
    make: 'Toyota',
    model: 'Corolla',
    year_range: JSON.stringify({ start: 2000, end: 2020 }),
    dimensions: JSON.stringify({ length: 4.63, width: 1.78, height: 1.43 }),
    source: 1,
    created_at: new Date(),
    updated_at: new Date(),
  },
  {
    make: 'Ford',
    model: 'Focus',
    year_range: JSON.stringify({ start: 2005, end: 2021 }),
    dimensions: JSON.stringify({ length: 4.37, width: 1.82, height: 1.46 }),
    source: 2,
    created_at: new Date(),
    updated_at: new Date(),
  },
]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('vehiclemodels');
  },
};