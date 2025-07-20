'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LoginAttempts', {  // שם הטבלה: LoginAttempts
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,  // כתובת האימייל של המשתמש
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM('user', 'admin'),  // סוג המשתמש (user או admin)
        allowNull: false,
      },
      success: {
        type: Sequelize.BOOLEAN,  // האם הכניסה הייתה מוצלחת או לא
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,  // כתובת ה-IP ממנה בוצע הניסיון
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.STRING,  // פרטי הדפדפן/מכשיר מהם בוצע הניסיון
        allowNull: false,
      },
      failureReason: {
        type: Sequelize.STRING,  // סיבת הכישלון (אם קיימת)
        allowNull: true,  // זהו שדה אופציונלי
      },
      timestamp: {
        type: Sequelize.DATE,  // זמן הניסיון
        allowNull: false,
        defaultValue: Sequelize.NOW,  // ברירת מחדל לזמן נוכחי
      },
    });

    // הוספת נתונים לדוגמה לטבלת LoginAttempts
    await queryInterface.bulkInsert('LoginAttempts', [
      {
        id: '1',
        email: 'user@example.com',
        userType: 'user',
        success: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        failureReason: null,
        timestamp: new Date(),
      },
      {
        id: '2',
        email: 'admin@example.com',
        userType: 'admin',
        success: false,
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
        failureReason: 'Incorrect password',
        timestamp: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("down");
    await queryInterface.dropTable('LoginAttempts');  // מחיקת הטבלה במקרה של חזרה אחורה
  }
};
