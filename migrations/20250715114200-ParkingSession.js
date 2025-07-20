'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת ParkingSessions
    await queryInterface.createTable('ParkingSessions', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי למפגש החניה
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  // מזהה המשתמש
        allowNull: false,
      },
      vehicleId: {
        type: Sequelize.STRING,  // מזהה הרכב
        allowNull: false,
      },
      licensePlate: {
        type: Sequelize.STRING,  // מספר רישוי הרכב
        allowNull: false,
      },
      surfaceSpot: {
        type: Sequelize.STRING,  // מספר מקום החניה בשטח (אופציונלי)
        allowNull: true,
      },
      undergroundSpot: {
        type: Sequelize.STRING,  // מספר מקום החניה תת קרקעי (אופציונלי)
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('parked', 'retrieval_requested', 'completed'),  // סטטוס המפגש
        allowNull: false,
      },
      entryTime: {
        type: Sequelize.DATE,  // זמן הכניסה לחניה
        allowNull: false,
      },
      exitTime: {
        type: Sequelize.DATE,  // זמן יציאה (אופציונלי)
        allowNull: true,
      },
      retrievalRequestTime: {
        type: Sequelize.DATE,  // זמן בקשת השליפה (אופציונלי)
        allowNull: true,
      },
      actualRetrievalTime: {
        type: Sequelize.DATE,  // זמן השליפה בפועל (אופציונלי)
        allowNull: true,
      },
      pickupSpot: {
        type: Sequelize.STRING,  // מקום השליפה בשטח (אופציונלי)
        allowNull: true,
      },
      requestedBy: {
        type: Sequelize.ENUM('mobile', 'tablet'),  // מהיכן בוצעה הבקשה לשליפה (אופציונלי)
        allowNull: true,
      },
    });

    // הכנסת נתונים לדוגמה לטבלת ParkingSessions
    await queryInterface.bulkInsert('ParkingSessions', [
      {
        id: '1',
        userId: 'user123',
        vehicleId: 'vehicle1',
        licensePlate: 'ABC123',
        surfaceSpot: '5',
        undergroundSpot: null,
        status: 'parked',
        entryTime: new Date('2025-07-15T07:00:00'),
        exitTime: null,
        retrievalRequestTime: null,
        actualRetrievalTime: null,
        pickupSpot: null,
        requestedBy: null,
      },
      {
        id: '2',
        userId: 'user456',
        vehicleId: 'vehicle2',
        licensePlate: 'XYZ456',
        surfaceSpot: '2',
        undergroundSpot: null,
        status: 'retrieval_requested',
        entryTime: new Date('2025-07-15T08:30:00'),
        exitTime: null,
        retrievalRequestTime: new Date('2025-07-15T09:00:00'),
        actualRetrievalTime: null,
        pickupSpot: '6',
        requestedBy: 'mobile',
      },
    ]);
  },


  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParkingSessions');  // מחיקת טבלת ParkingSessions במקרה של חזרה אחורה
  }
};
