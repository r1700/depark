'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('parkingsessions', {
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
      vehicle_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
     parking_spots_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      license_plate: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surface_spot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      underground_spot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=parked, 2=retrieval_requested, 3=completed',
      },
      entry_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      exit_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      retrieval_request_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      actual_retrieval_time: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      pickup_spot: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requested_by: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: '1=mobile, 2=tablet',
      },
    });

      await queryInterface.bulkInsert('parkingsessions', [
      {
        baseuser_id: 1,
        vehicle_id: 1,
        parking_spots_id: 1,
        license_plate: 'ABC123',
        surface_spot: '5',
        underground_spot: null,
        status: 1,
        entry_time: new Date('2025-07-15T07:00:00'),
        exit_time: null,
        retrieval_request_time: null,
        actual_retrieval_time: null,
        pickup_spot: null,
        requested_by: null,
       
      },
      {
        baseuser_id: 2,
        vehicle_id: 2,
        parking_spots_id: 2,
        license_plate: 'XYZ456',
        surface_spot: '2',
        underground_spot: null,
        status: 2,
        entry_time: new Date('2025-07-15T08:30:00'),
        exit_time: null,
        retrieval_request_time: new Date('2025-07-15T09:00:00'),
        actual_retrieval_time: null,
        pickup_spot: '6',
        requested_by: 1,
        
      },
    ]);
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('parkingsessions');
  }
};

