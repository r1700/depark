'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת NotificationLogs
    await queryInterface.createTable('NotificationLogs', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.ENUM('queue_update', 'retrieval_ready', 'parking_full', 'system_maintenance'),
        allowNull: false,
      },
      channel: {
        type: Sequelize.ENUM('websocket', 'push_notification'),
        allowNull: false,
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
      deliveredAt: {
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
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // הכנסת נתונים לדוגמה לטבלת NotificationLogs
    await queryInterface.bulkInsert('NotificationLogs', [
      {
        id: '1',
        userId: 'user123',
        type: 'queue_update',
        channel: 'websocket',
        message: 'Queue has been updated.',
        delivered: true,
        deliveredAt: new Date(),
        error: null,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user456',
        type: 'retrieval_ready',
        channel: 'push_notification',
        message: 'Your vehicle is ready for retrieval.',
        delivered: false,
        deliveredAt: null,
        error: 'Failed to deliver',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        userId: 'user789',
        type: 'parking_full',
        channel: 'websocket',
        message: 'Parking is full. Please try again later.',
        delivered: true,
        deliveredAt: new Date(),
        error: null,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '4',
        userId: null,  // יכול להיות null אם לא קשור למשתמש מסויים
        type: 'system_maintenance',
        channel: 'push_notification',
        message: 'Scheduled system maintenance at 2 AM.',
        delivered: true,
        deliveredAt: new Date(),
        error: null,
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('NotificationLogs');  // מחיקת הטבלה במקרה של rollback
  }
};
