'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת VehicleModels
    await queryInterface.createTable('VehicleModels', {
      id: {
        type: Sequelize.STRING,  // id מסוג string
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
      yearRange: {
        type: Sequelize.JSONB,  // אובייקט JSON לאחסון טווח השנים
        allowNull: false,
      },
      dimensions: {
        type: Sequelize.JSONB,  // אובייקט JSON לאחסון מימדים
        allowNull: false,
      },
      source: {
        type: Sequelize.ENUM('manual', 'government_db', 'hr_input'),  // מקור המידע
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,  // תאריך יצירת המודל
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
      updatedAt: {
        type: Sequelize.DATE,  // תאריך עדכון המודל
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
      updatedBy: {
        type: Sequelize.STRING,  // מזהה המנהל שהעדכן את המודל (אופציונלי)
        allowNull: true,
      },
    });

    // הוספת נתונים לטבלת VehicleModels
    await queryInterface.bulkInsert('VehicleModels', [
      {
        id: '1',
        make: 'Toyota',
        model: 'Corolla',
        yearRange: JSON.stringify({ start: 2000, end: 2020 }), // המרת לטקסט JSON
        dimensions: JSON.stringify({ length: 4.63, width: 1.78, height: 1.43 }), // המרת לטקסט JSON
        source: 'manual',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'admin',
      },
      {
        id: '2',
        make: 'Ford',
        model: 'Focus',
        yearRange: JSON.stringify({ start: 2005, end: 2021 }), // המרת לטקסט JSON
        dimensions: JSON.stringify({ length: 4.37, width: 1.82, height: 1.46 }), // המרת לטקסט JSON
        source: 'government_db',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'admin',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת VehicleModels במקרה של חזרה אחורה
    await queryInterface.dropTable('VehicleModels');
  }
};
