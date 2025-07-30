'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('queueupdates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      retrieval_queue_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      estimated_time: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=queued, 2=processing, 3=ready',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      broadcast_to: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=specific_user, 2=all_tablets, 3=all_connected',
      },
  
    });

    await queryInterface.bulkInsert('queueupdates', [
      {
        retrieval_queue_id: 1,
        position: 1,
        estimated_time: new Date('2025-07-15T08:00:00'),
        status: 1,
        message: 'The queue is processing your request.',
        timestamp: new Date(),
        broadcast_to: 3,
      
      },
      {
        retrieval_queue_id: 2,
        position: 2,
        estimated_time: new Date('2025-07-15T09:00:00'),
        status: 2, 
        message: 'Request is being processed.',
        timestamp: new Date(),
        broadcast_to: 2, 
     
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('queueupdates');
  }
};