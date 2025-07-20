'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת ParkingUsageStats
    await queryInterface.createTable('ParkingUsageStats', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי לכל רישום סטטיסטי
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,  // תאריך המדידה
        allowNull: false,
      },
      hour: {
        type: Sequelize.INTEGER,  // שעה ביום (בין 0 ל-23)
        allowNull: false,
      },
      totalParkedCars: {
        type: Sequelize.INTEGER,  // סך כל המכוניות החונות באותו זמן
        allowNull: false,
      },
      avgRetrievalTime: {
        type: Sequelize.INTEGER,  // זמן ממוצע לשחרור מכונית (בדקות)
        allowNull: false,
      },
      maxQueueLength: {
        type: Sequelize.INTEGER,  // אורך התור המקסימלי
        allowNull: false,
      },
      peakUsageTime: {
        type: Sequelize.STRING,  // הזמן המקסימלי שבו הייתה עלות השימוש
        allowNull: false,
      },
      utilizationPercentage: {
        type: Sequelize.FLOAT,  // אחוז ניצול המתקן
        allowNull: false,
      },
      totalEntries: {
        type: Sequelize.INTEGER,  // סך כל הכניסות במהלך הזמן המדוד
        allowNull: false,
      },
      totalExits: {
        type: Sequelize.INTEGER,  // סך כל היציאות במהלך הזמן המדוד
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

    // הכנסת נתונים לדוגמה לטבלת ParkingUsageStats
    await queryInterface.bulkInsert('ParkingUsageStats', [
      {
        id: '1',
        date: new Date('2025-07-15'),
        hour: 7,
        totalParkedCars: 30,
        avgRetrievalTime: 5,
        maxQueueLength: 10,
        peakUsageTime: '08:00',
        utilizationPercentage: 85.5,
        totalEntries: 50,
        totalExits: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        date: new Date('2025-07-15'),
        hour: 8,
        totalParkedCars: 35,
        avgRetrievalTime: 7,
        maxQueueLength: 12,
        peakUsageTime: '09:00',
        utilizationPercentage: 90.3,
        totalEntries: 60,
        totalExits: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    // מחיקת טבלת ParkingUsageStats במקרה של חזרה אחורה
    await queryInterface.dropTable('ParkingUsageStats');
  }
};
