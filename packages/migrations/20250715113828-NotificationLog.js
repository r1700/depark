'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notificationlogs', {
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
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=queue_update, 2=retrieval_ready, 3=parking_full, 4=system_maintenance',
      },
      channel: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=websocket, 2=push_notification',
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      delivered: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      delivered_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      error: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('notificationlogs', [
      {
        baseuser_id: 1,
        type: 1,
        channel: 1,
        message: 'Queue has been updated.',
        delivered: true,
        delivered_at: new Date(),
        error: null,
        timestamp: new Date(),
      
      },
      {
        baseuser_id: 2,
        type: 2,
        channel: 2,
        message: 'Your vehicle is ready for retrieval.',
        delivered: false,
        delivered_at: null,
        error: 'Failed to deliver',
        timestamp: new Date(),
      
      },
      {
        baseuser_id: 3,
        type: 3,
        channel: 1,
        message: 'Parking is full. Please try again later.',
        delivered: true,
        delivered_at: new Date(),
        error: null,
        timestamp: new Date(),
       
      },
      {
        baseuser_id: 4,
        type: 4,
        channel: 2,
        message: 'Scheduled system maintenance at 2 AM.',
        delivered: true,
        delivered_at: new Date(),
        error: null,
        timestamp: new Date(),
      
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notificationlogs');
  }
};
