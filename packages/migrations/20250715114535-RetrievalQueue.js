'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('retrievalqueues', {
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
      parking_session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      license_plate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      underground_spot: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      requested_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      estimated_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=queued, 2=processing, 3=ready, 4=completed',
      },
      assigned_pickup_spot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      request_source: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=mobile, 2=tablet',
      },
    });

    await queryInterface.bulkInsert('retrievalqueues', [
      {
        baseuser_id: 1,
        parking_session_id: 1,
        license_plate: 'ABC123',
        underground_spot: 'B1',
        requested_at: new Date('2025-07-15T08:00:00'),
        estimated_time: new Date('2025-07-15T08:15:00'),
        position: 1,
        status: 1,
        assigned_pickup_spot: 'A1',
        request_source: 1,
      },
      {
        baseuser_id: 2,
        parking_session_id: 2,
        license_plate: 'XYZ456',
        underground_spot: 'B2',
        requested_at: new Date('2025-07-15T08:30:00'),
        estimated_time: new Date('2025-07-15T08:45:00'),
        position: 2,
        status: 2,
        assigned_pickup_spot: 'A2',
        request_source: 2,
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('retrievalqueues');
  }
};