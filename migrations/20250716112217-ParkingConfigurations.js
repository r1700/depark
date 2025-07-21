'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParkingConfigurations', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי
        primaryKey: true,
        allowNull: false,
      },
      facilityName: {
        type: Sequelize.STRING,  // שם המתקן או החניון
        allowNull: false,
      },
      totalSurfaceSpots: {
        type: Sequelize.INTEGER,  // סך כל המקומות על פני השטח
        allowNull: false,
      },
      surfaceSpotIds: {
        type: Sequelize.ARRAY(Sequelize.STRING),  // מזהים של המקומות על פני השטח
        allowNull: false,
      },
      avgRetrievalTimeMinutes: {
        type: Sequelize.INTEGER,  // זמן ממוצע לשליפה (בדקות), ברירת המחדל 1
        defaultValue: 1,
        allowNull: false,
      },
      maxQueueSize: {
        type: Sequelize.INTEGER,  // גודל התור המרבי
        allowNull: false,
      },
      operatingHours: {
        type: Sequelize.JSON,  // שדה מסוג JSON
        allowNull: false,
      },
      timezone: {
        type: Sequelize.STRING,  // אזור הזמן
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,  // זמן עדכון אחרון
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedBy: {
        type: Sequelize.STRING,  // מזהה המנהל ששינה את הנתונים
        allowNull: false,
      },
    });

    // הכנסת נתונים לדוגמה לטבלת ParkingConfigurations
    await queryInterface.bulkInsert('ParkingConfigurations', [
      {
        id: '1',
        facilityName: 'Central Parking Lot',
        totalSurfaceSpots: 50,
        surfaceSpotIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avgRetrievalTimeMinutes: 5,
        maxQueueSize: 10,
        operatingHours: JSON.stringify({ start: '07:00', end: '19:00' }),  // השתמש ב-JSON.stringify
        timezone: 'Asia/Jerusalem',
        updatedAt: new Date(),
        updatedBy: 'admin123',
      },
      {
        id: '2',
        facilityName: 'North Parking Garage',
        totalSurfaceSpots: 30,
        surfaceSpotIds: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        avgRetrievalTimeMinutes: 3,
        maxQueueSize: 5,
        operatingHours: JSON.stringify({ start: '08:00', end: '20:00' }),  // השתמש ב-JSON.stringify
        timezone: 'Asia/Jerusalem',
        updatedAt: new Date(),
        updatedBy: 'admin456',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParkingConfigurations');
  }
};
