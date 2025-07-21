'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת UnknownVehicleModels
    await queryInterface.createTable('UnknownVehicleModels', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי למודל הרכב הלא ידוע
        primaryKey: true,
        allowNull: false,
      },
      make: {
        type: Sequelize.STRING,  // יצרן הרכב
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING,  // מודל הרכב
        allowNull: false,
      },
      requestCount: {
        type: Sequelize.INTEGER,  // מספר הפעמים שהמודל הלא ידוע התבקש
        allowNull: false,
        defaultValue: 0,  // ברירת מחדל 0
      },
      lastRequested: {
        type: Sequelize.DATE,  // תאריך הפנייה האחרונה
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
      status: {
        type: Sequelize.ENUM('pending_review', 'resolved', 'ignored'),  // סטטוס המודל
        allowNull: false,
      },
      resolvedBy: {
        type: Sequelize.STRING,  // מזהה המנהל שביצע את הפתרון (אופציונלי)
        allowNull: true,
      },
      resolvedAt: {
        type: Sequelize.DATE,  // תאריך הפתרון (אופציונלי)
        allowNull: true,
      },
      resolvedVehicleModelId: {
        type: Sequelize.STRING,  // מזהה המודל שקשור למודל הרכב אחרי פתרון
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,  // תאריך יצירת המודל
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
    });

    // הכנסת נתונים לדוגמה לטבלת UnknownVehicleModels
    await queryInterface.bulkInsert('UnknownVehicleModels', [
      {
        id: '1',
        make: 'Toyota',
        model: 'Corolla',
        requestCount: 3,
        lastRequested: new Date(),
        status: 'pending_review',
        createdAt: new Date(),
      },
      {
        id: '2',
        make: 'Honda',
        model: 'Civic',
        requestCount: 5,
        lastRequested: new Date(),
        status: 'resolved',
        resolvedBy: 'admin1',
        resolvedAt: new Date(),
        resolvedVehicleModelId: 'H123',
        createdAt: new Date(),
      },
      {
        id: '3',
        make: 'Ford',
        model: 'Focus',
        requestCount: 2,
        lastRequested: new Date(),
        status: 'ignored',
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UnknownVehicleModels');  // מחיקת טבלת UnknownVehicleModels במקרה של חזרה אחורה
  }
};
