'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת VehicleReports
    await queryInterface.createTable('VehicleReports', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי לדוח
        primaryKey: true,
        allowNull: false,
      },
      totalVehicles: {
        type: Sequelize.INTEGER,  // מספר הרכבים הכולל
        allowNull: false,
      },
      activeVehicles: {
        type: Sequelize.INTEGER,  // מספר הרכבים הפעילים
        allowNull: false,
      },
      unknownModels: {
        type: Sequelize.INTEGER,  // מספר הדגמים הלא מזוהים
        allowNull: false,
      },
      dimensionSources: {
        type: Sequelize.JSONB,  // מקורות ממדי הרכב (JSON או JSONB)
        allowNull: false,
      },
      topMakes: {
        type: Sequelize.JSONB,  // מידע על היצרנים המובילים
        allowNull: false,
      },
      generatedBy: {
        type: Sequelize.STRING,  // מזהה המשתמש שיצר את הדוח
        allowNull: false,
      },
      generatedAt: {
        type: Sequelize.DATE,  // הזמן בו נוצר הדוח
        allowNull: false,
        defaultValue: Sequelize.NOW,  // ברירת מחדל לזמן נוכחי
      },
    });

    // הוספת דוח לדוגמה
    await queryInterface.bulkInsert('VehicleReports', [
      {
        id: '1',
        totalVehicles: 500,
        activeVehicles: 400,
        unknownModels: 50,
        dimensionSources: JSON.stringify({ manual: 100, government_db: 200, model_default: 50 }),
        topMakes: JSON.stringify([{ make: 'Toyota', count: 100 }, { make: 'Honda', count: 80 }]),
        generatedBy: 'admin',
        generatedAt: new Date(),
      },
      {
        id: '2',
        totalVehicles: 450,
        activeVehicles: 350,
        unknownModels: 30,
        dimensionSources: JSON.stringify({ manual: 120, government_db: 150, model_default: 40 }),
        topMakes: JSON.stringify([{ make: 'Ford', count: 90 }, { make: 'BMW', count: 60 }]),
        generatedBy: 'admin',
        generatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת VehicleReports במקרה של חזרה אחורה
    await queryInterface.dropTable('VehicleReports');
  }
};
