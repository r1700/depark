'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parkingconfigurations', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      facility_name: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      total_surface_spots: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      surface_spot_ids: {
        type: Sequelize.ARRAY(Sequelize.STRING),  
        allowNull: false,
      },
      avg_retrieval_time_minutes: {
        type: Sequelize.INTEGER,  
        defaultValue: 1,
        allowNull: false,
      },
      max_queue_size: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      operating_hours: {
        type: Sequelize.JSON,  
        allowNull: false,
      },
      timezone: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_by: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('parkingconfigurations', [
      {
        id: 'main',
        facility_name: 'Central Parking Lot',
        total_surface_spots: 50,
        surface_spot_ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avg_retrieval_time_minutes: 5,
        max_queue_size: 10,
        operating_hours: JSON.stringify({ start: '07:00', end: '19:00' }),  
        timezone: 'Asia/Jerusalem',
        updated_at: new Date(),
        updated_by: 'admin123',
      },
      {
        id: 'north',
        facility_name: 'North Parking Garage',
        total_surface_spots: 30,
        surface_spot_ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avg_retrieval_time_minutes: 3,
        max_queue_size: 5,
        operating_hours: JSON.stringify({ start: '08:00', end: '20:00' }),  
        timezone: 'Asia/Jerusalem',
        updated_at: new Date(),
        updated_by: 'admin456',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parkingconfigurations');
  }
};
