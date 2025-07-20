'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת OPCSystemStatuses
    await queryInterface.createTable('OPCSystemStatuses', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      isConnected: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      lastHeartbeat: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      availableSurfaceSpots: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      queueLength: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      systemErrors: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      performanceMetrics: {
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

    // הכנסת נתונים לדוגמה לטבלת OPCSystemStatuses
    await queryInterface.bulkInsert('OPCSystemStatuses', [
      {
        id: '1',
        isConnected: true,
        lastHeartbeat: new Date(),
        availableSurfaceSpots: 10,
        queueLength: 5,
        systemErrors: JSON.stringify(['Error 1', 'Error 2']),
        performanceMetrics: JSON.stringify({
          avgRetrievalTime: 5,
          successfulRetrievals: 100,
          failedOperations: 2,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        isConnected: false,
        lastHeartbeat: new Date(),
        availableSurfaceSpots: 0,
        queueLength: 15,
        systemErrors: JSON.stringify(['Error 3']),
        performanceMetrics: JSON.stringify({
          avgRetrievalTime: 7,
          successfulRetrievals: 80,
          failedOperations: 5,
        }),
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('OPCSystemStatuses');  // מחיקת הטבלה במקרה של rollback
  }
};
