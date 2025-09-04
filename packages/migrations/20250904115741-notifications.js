'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
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
        type: Sequelize.STRING,
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      read: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // נתוני דוגמה
    await queryInterface.bulkInsert('notifications', [
      {
        baseuser_id: 1,
        type: 'retrieval_ready',
        message: 'Your car is ready for pickup.',
        read: false,
        timestamp: new Date(),
      },
      {
        baseuser_id: 2,
        type: 'queue_update',
        message: 'Your position in the queue has changed.',
        read: false,
        timestamp: new Date(),
      },
      {
        baseuser_id: 3,
        type: 'system_alert',
        message: 'System maintenance will occur tonight at 11 PM.',
        read: true,
        timestamp: new Date(),
      },
      {
        baseuser_id: 1,
        type: 'promotion',
        message: 'You have earned a free parking voucher!',
        read: false,
        timestamp: new Date(),
      },
      {
        baseuser_id: 4,
        type: 'retrieval_ready',
        message: 'Your vehicle is now available at spot B12.',
        read: true,
        timestamp: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications');
  }
};


