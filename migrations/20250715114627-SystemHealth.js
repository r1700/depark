'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת SystemHealths
    await queryInterface.createTable('SystemHealths', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי
        primaryKey: true,
        allowNull: false,
      },
      component: {
        type: Sequelize.ENUM('opc_bridge', 'api_server', 'database', 'websocket_server', 'government_sync'),  // רכיב המערכת
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('healthy', 'warning', 'error'),  // מצב הרכיב
        allowNull: false,
      },
      message: {
        type: Sequelize.STRING,  // הודעה אופציונלית המפרטת את המצב
        allowNull: true,
      },
      metrics: {
        type: Sequelize.JSONB,  // נתוני מדדים (כגון: זיכרון, זמן תגובה וכו')
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,  // זמן בו נבדק המצב
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
    });

    // הכנסת נתונים לדוגמה לטבלת SystemHealths
    await queryInterface.bulkInsert('SystemHealths', [
      {
        id: '1',
        component: 'api_server',
        status: 'healthy',
        message: 'API server is running smoothly.',
        metrics: JSON.stringify({
          memoryUsage: 50,
          responseTime: 200,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        component: 'websocket_server',
        status: 'warning',
        message: 'WebSocket server is experiencing high latency.',
        metrics: JSON.stringify({
          memoryUsage: 70,
          responseTime: 500,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '3',
        component: 'database',
        status: 'error',
        message: 'Database connection failed.',
        metrics: JSON.stringify({
          memoryUsage: 90,
          responseTime: 1000,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SystemHealths');  // מחיקת טבלת SystemHealths במקרה של חזרה אחורה
  }
};
