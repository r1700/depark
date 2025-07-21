'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת הטבלה UserActivities
    await queryInterface.createTable('UserActivities', { 
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי לכל פעולה
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  // מזהה המשתמש שביצע את הפעולה
        allowNull: true,
      },
      userType: {
        type: Sequelize.ENUM('hr', 'admin', 'employee', 'anonymous'),  // סוג המשתמש
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,  // פעולה שנעשתה
        allowNull: false,
      },
      details: {
        type: Sequelize.JSONB,  // פרטי הפעולה
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,  // כתובת ה-IP של המשתמש
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.STRING,  // מידע על הדפדפן או הלקוח
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,  // זמן ביצוע הפעולה
        allowNull: false,
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

    // הכנסת נתונים לדוגמה
    await queryInterface.bulkInsert('UserActivities', [
      {
        id: '1',
        userId: 'user123',
        userType: 'admin',
        action: 'login',
        details: JSON.stringify({ success: true }),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user456',
        userType: 'employee',
        action: 'update_profile',
        details: JSON.stringify({ field: 'email', oldValue: 'user@old.com', newValue: 'user@new.com' }),
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת UserActivities במקרה של חזרה אחורה
    await queryInterface.dropTable('UserActivities');
  }
};
