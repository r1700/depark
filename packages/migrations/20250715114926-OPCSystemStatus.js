'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('opcsystemstatuses', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      is_connected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      last_heartbeat: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      available_surface_spots: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      queue_length: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      system_errors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      performance_metrics: {
        type: Sequelize.JSONB,
        allowNull: false,
        defaultValue: {
          avgRetrievalTime: 0,
          successfulRetrievals: 0,
          failedOperations: 0,
        },
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
  
    });

    await queryInterface.bulkInsert('opcsystemstatuses', [
      {
        is_connected: true,
        last_heartbeat: new Date(),
        available_surface_spots: 10,
        queue_length: 5,
        system_errors: JSON.stringify(['Error 1', 'Error 2']),
        performance_metrics: JSON.stringify({
          avgRetrievalTime: 5,
          successfulRetrievals: 100,
          failedOperations: 2,
        }),
        timestamp: new Date(),
    
      },
      {
        is_connected: false,
        last_heartbeat: new Date(),
        available_surface_spots: 0,
        queue_length: 15,
        system_errors: JSON.stringify(['Error 3']),
        performance_metrics: JSON.stringify({
          avgRetrievalTime: 7,
          successfulRetrievals: 80,
          failedOperations: 5,
        }),
        timestamp: new Date(),
        
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('opcsystemstatuses');  
  }
};
