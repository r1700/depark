'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת WebSocketConnections
    await queryInterface.createTable('WebSocketConnections', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  // מזהה משתמש (אופציונלי - null עבור חיבורים מטאבלט)
        allowNull: true,
      },
      connectionType: {
        type: Sequelize.ENUM('mobile', 'tablet'),  // סוג החיבור (נייד או טאבלט)
        allowNull: false,
      },
      isActive: {
        type: Sequelize.BOOLEAN,  // האם החיבור פעיל
        allowNull: false,
        defaultValue: true,  // ברירת מחדל: חיבור פעיל
      },
      connectedAt: {
        type: Sequelize.DATE,  // זמן החיבור
        allowNull: false,
      },
      lastActivity: {
        type: Sequelize.DATE,  // זמן הפעילות האחרונה
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,  // כתובת ה-IP של החיבור
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

    // הוספת חיבורים לדוגמה
    await queryInterface.bulkInsert('WebSocketConnections', [
      {
        id: 'connection1',
        userId: 'user123',
        connectionType: 'mobile',
        isActive: true,
        connectedAt: new Date(),
        lastActivity: new Date(),
        ipAddress: '192.168.1.1',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 'connection2',
        userId: null,  // טאבלט (אין userId)
        connectionType: 'tablet',
        isActive: true,
        connectedAt: new Date(),
        lastActivity: new Date(),
        ipAddress: '192.168.1.2',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת WebSocketConnections במקרה של חזרה אחורה
    await queryInterface.dropTable('WebSocketConnections');
  }
};
