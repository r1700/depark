'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת QueueUpdates
    await queryInterface.createTable('QueueUpdates', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי
        primaryKey: true,
        allowNull: false,
      },
      retrievalQueueId: {
        type: Sequelize.STRING,  // מזהה תור המשחק (recovery queue)
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,  // מיקום בתור
        allowNull: false,
      },
      estimatedTime: {
        type: Sequelize.DATE,  // זמן משוער
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('queued', 'processing', 'ready'),  // מצב עדכון התור
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,  // הודעה אופציונלית
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,  // זמן התיעוד
        allowNull: false,
        defaultValue: Sequelize.NOW,  // ברירת מחדל לזמן נוכחי
      },
      broadcastTo: {
        type: Sequelize.ENUM('specific_user', 'all_tablets', 'all_connected'),  // מי מקבל את השידור
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // ברירת מחדל לזמן נוכחי
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // ברירת מחדל לזמן נוכחי
      },
    });

    // הכנסת נתונים לדוגמה לטבלת QueueUpdates
    await queryInterface.bulkInsert('QueueUpdates', [
      {
        id: '1',
        retrievalQueueId: 'queue001',
        position: 1,
        estimatedTime: new Date('2025-07-15T08:00:00'),
        status: 'queued',
        message: 'The queue is processing your request.',
        timestamp: new Date(),
        broadcastTo: 'all_connected',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        retrievalQueueId: 'queue002',
        position: 2,
        estimatedTime: new Date('2025-07-15T09:00:00'),
        status: 'processing',
        message: 'Request is being processed.',
        timestamp: new Date(),
        broadcastTo: 'all_tablets',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('QueueUpdates');  // מחיקת הטבלה במקרה של חזרה אחורה
  }
};
