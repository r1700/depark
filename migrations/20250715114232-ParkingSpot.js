'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת ParkingSpots
    await queryInterface.createTable('ParkingSpots', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי למקום החניה
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('surface', 'underground'),  // סוג החניה: שטחית או תת קרקעית
        allowNull: false,
      },
      spotNumber: {
        type: Sequelize.STRING,  // מספר המקום בחניה
        allowNull: false,
      },
      isOccupied: {
        type: Sequelize.BOOLEAN,  // האם המקום תפוס
        allowNull: false,
        defaultValue: false,  // ברירת מחדל: לא תפוס
      },
      currentVehicleId: {
        type: Sequelize.STRING,  // מזהה הרכב התפוס (אופציונלי)
        allowNull: true,
      },
      lastUpdated: {
        type: Sequelize.DATE,  // תאריך עדכון אחרון של המקום
        allowNull: false,
        defaultValue: Sequelize.NOW,  // זמן ברירת מחדל
      },
    });

    // הכנסת נתונים לדוגמה לטבלת ParkingSpots
    await queryInterface.bulkInsert('ParkingSpots', [
      {
        id: '1',
        type: 'surface',
        spotNumber: 'A1',
        isOccupied: false,
        currentVehicleId: null,
        lastUpdated: new Date(),
      },
      {
        id: '2',
        type: 'surface',
        spotNumber: 'A2',
        isOccupied: true,
        currentVehicleId: 'vehicle123',
        lastUpdated: new Date(),
      },
      {
        id: '3',
        type: 'underground',
        spotNumber: 'B1',
        isOccupied: false,
        currentVehicleId: null,
        lastUpdated: new Date(),
      },
      {
        id: '4',
        type: 'underground',
        spotNumber: 'B2',
        isOccupied: true,
        currentVehicleId: 'vehicle456',
        lastUpdated: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת ParkingSpots במקרה של חזרה אחורה
    await queryInterface.dropTable('ParkingSpots');
  }
};
