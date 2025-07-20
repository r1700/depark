'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת UserSessions
    await queryInterface.createTable('UserSessions', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM('user', 'admin'),
        allowNull: false,
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      refreshToken: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expiresAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ipAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      lastActivity: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // הכנסת נתונים
    await queryInterface.bulkInsert('UserSessions', [
      {
        id: 'session1',
        userId: 'user1',
        userType: 'user',
        token: 'token12345',
        refreshToken: 'refreshToken123',
        expiresAt: new Date(Date.now() + 3600 * 1000),  // שעה קדימה
        isActive: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        createdAt: new Date(),
        lastActivity: new Date(),
      },
      {
        id: 'session2',
        userId: 'admin1',
        userType: 'admin',
        token: 'token67890',
        refreshToken: 'refreshToken456',
        expiresAt: new Date(Date.now() + 3600 * 1000),  // שעה קדימה
        isActive: true,
        ipAddress: '192.168.1.2',
        userAgent: 'Chrome/91.0',
        createdAt: new Date(),
        lastActivity: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת UserSessions במקרה של חזרה אחורה
    await queryInterface.dropTable('UserSessions');
  }
};
