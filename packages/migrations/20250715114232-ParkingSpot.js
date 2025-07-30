'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parkingspots', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
       vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=surface, 2=underground',
      },
      spot_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      is_occupied: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      current_vehicle_id: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      last_updated: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

   await queryInterface.bulkInsert('parkingspots', [
      {
        vehicle_id: 1,
        type: 1,
        spot_number: 'A1',
        is_occupied: false,
        current_vehicle_id: null,
        last_updated: new Date(),
      
      },
      {
        vehicle_id: 2,
        type: 1,
        spot_number: 'A2',
        is_occupied: true,
        current_vehicle_id: 'vehicle123',
        last_updated: new Date(),
      },
      {
        vehicle_id: 3,
        type: 2,
        spot_number: 'B1',
        is_occupied: false,
        current_vehicle_id: null,
        last_updated: new Date(),
      },
      {
        vehicle_id: 4,
        type: 2,
        spot_number: 'B2',
        is_occupied: true,
        current_vehicle_id: 'vehicle456',
        last_updated: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parkingspots');
  }
};