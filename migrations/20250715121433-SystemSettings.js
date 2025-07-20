'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת SystemSettings
    await queryInterface.createTable('SystemSettings', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי לכל הגדרה במערכת
        primaryKey: true,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,  // המפתח של ההגדרה
        allowNull: false,
        unique: true,  // מפתח ייחודי לכל הגדרה
      },
      value: {
        type: Sequelize.STRING,  // ערך ההגדרה, יכול להיות string, number או boolean
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,  // תיאור קצר של ההגדרה
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('parking', 'auth', 'notifications', 'integration', 'government_db'),  // קטגוריה של ההגדרה
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,  // זמן העדכון האחרון
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
      updatedBy: {
        type: Sequelize.STRING,  // מזהה המנהל ששינה את ההגדרה
        allowNull: false,
      },
    });

    // הכנסת נתונים לדוגמה לטבלת SystemSettings
    await queryInterface.bulkInsert('SystemSettings', [
      {
        id: '1',
        key: 'maxParkingTime',
        value: '120', // דקות
        description: 'Max time a vehicle can park in the facility',
        category: 'parking',
        updatedAt: new Date(),
        updatedBy: 'admin1',
      },
      {
        id: '2',
        key: 'authTimeout',
        value: '30', // דקות
        description: 'Timeout for user authentication session',
        category: 'auth',
        updatedAt: new Date(),
        updatedBy: 'admin2',
      },
      {
        id: '3',
        key: 'notificationEmail',
        value: 'support@example.com',
        description: 'Email address for system notifications',
        category: 'notifications',
        updatedAt: new Date(),
        updatedBy: 'admin3',
      },
      {
        id: '4',
        key: 'integrationEnabled',
        value: 'true', // boolean
        description: 'Is system integration enabled',
        category: 'integration',
        updatedAt: new Date(),
        updatedBy: 'admin4',
      },
      {
        id: '5',
        key: 'govSyncInterval',
        value: '3600', // seconds
        description: 'Interval between government database syncs',
        category: 'government_db',
        updatedAt: new Date(),
        updatedBy: 'admin5',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SystemSettings');  // מחיקת טבלת SystemSettings במקרה של חזרה אחורה
  }
};
