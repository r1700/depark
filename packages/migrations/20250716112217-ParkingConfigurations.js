'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parkingconfigurations', {
      id: {
        type: Sequelize.INTEGER,  
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
      max_parallel_retrievals: {
        type: Sequelize.INTEGER,  
        defaultValue: 1,
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
      maintenance_mode: {
        type: Sequelize.BOOLEAN,  
        defaultValue: false,
        allowNull: false,
      },
      show_admin_analytics: {
        type: Sequelize.BOOLEAN,  
        defaultValue: false,
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
        facility_name: 'Central Parking Lot',
        total_surface_spots: 50,
        surface_spot_ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avg_retrieval_time_minutes: 5,
        max_queue_size: 10,
        max_parallel_retrievals: 2,
        operating_hours: JSON.stringify({ 
          Sunday: { isActive: true, openingHour: "07:00", closingHour: "19:00" },
          Monday: { isActive: true, openingHour: "07:00", closingHour: "19:00" },
          Tuesday: { isActive: true, openingHour: "07:00", closingHour: "19:00" },
          Wednesday: { isActive: true, openingHour: "07:00", closingHour: "19:00" },
          Thursday: { isActive: true, openingHour: "07:00", closingHour: "19:00" },
          Friday: { isActive: true, openingHour: "07:00", closingHour: "19:00" },
          Saturday: { isActive: false, openingHour: "00:00", closingHour: "00:00" }
        }),  
        timezone: 'Asia/Jerusalem',
        maintenance_mode: false,
        show_admin_analytics: true,
        updated_at: new Date(),
        updated_by: 'admin123',
      },
      {
        facility_name: 'North Parking Garage',
        total_surface_spots: 30,
        surface_spot_ids: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avg_retrieval_time_minutes: 3,
        max_queue_size: 5,
        max_parallel_retrievals: 1,
        operating_hours: JSON.stringify({
          Sunday: { isActive: true, openingHour: "08:00", closingHour: "20:00" },
          Monday: { isActive: true, openingHour: "08:00", closingHour: "20:00" },
          Tuesday: { isActive: true, openingHour: "08:00", closingHour: "20:00" },
          Wednesday: { isActive: true, openingHour: "08:00", closingHour: "20:00" },
          Thursday: { isActive: true, openingHour: "08:00", closingHour: "20:00" },
          Friday: { isActive: true, openingHour: "08:00", closingHour: "20:00" },
          Saturday: { isActive: false, openingHour: "00:00", closingHour: "00:00" }
        }),  
        timezone: 'Asia/Jerusalem',
        maintenance_mode: false,
        show_admin_analytics: false,
        updated_at: new Date(),
        updated_by: 'admin456',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parkingconfigurations');
  }
};
