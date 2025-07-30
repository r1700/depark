'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parkingusagestats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      hour: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_parked_cars: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      avg_retrieval_time: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      max_queue_length: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      peak_usage_time: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      utilization_percentage: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      total_entries: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      total_exits: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('parkingusagestats', [
      {
        date: new Date('2025-07-15'),
        hour: 7,
        total_parked_cars: 30,
        avg_retrieval_time: 5,
        max_queue_length: 10,
        peak_usage_time: '08:00',
        utilization_percentage: 85.5,
        total_entries: 50,
        total_exits: 40,
      },
      {
        date: new Date('2025-07-15'),
        hour: 8,
        total_parked_cars: 35,
        avg_retrieval_time: 7,
        max_queue_length: 12,
        peak_usage_time: '09:00',
        utilization_percentage: 90.3,
        total_entries: 60,
        total_exits: 55,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parkingusagestats');
  },
};