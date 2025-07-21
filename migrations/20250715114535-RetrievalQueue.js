'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // יצירת טבלת RetrievalQueues
    await queryInterface.createTable('RetrievalQueues', {
      id: {
        type: Sequelize.STRING,  // מזהה ייחודי לתור של הבקשה
        primaryKey: true,
        allowNull: false,
      },
      sessionId: {
        type: Sequelize.STRING,  // מזהה של מפגש החניה שאליו שייך הבקשה
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  // מזהה המשתמש, אם בוצעה בקשה ממכשיר נייד (אופציונלי, null אם מדובר בבקשה מטאבלט)
        allowNull: true,
      },
      licensePlate: {
        type: Sequelize.STRING,  // מספר הרישוי של הרכב
        allowNull: false,
      },
      undergroundSpot: {
        type: Sequelize.STRING,  // מקום החניה התת-קרקעי שאליו הרכב צריך להגיע
        allowNull: false,
      },
      requestedAt: {
        type: Sequelize.DATE,  // זמן בקשת השליפה
        allowNull: false,
      },
      estimatedTime: {
        type: Sequelize.DATE,  // זמן משוער לפינוי הרכב
        allowNull: false,
      },
      position: {
        type: Sequelize.INTEGER,  // מיקום בבקשה בתור
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('queued', 'processing', 'ready', 'completed'),  // סטטוס הבקשה בתור
        allowNull: false,
      },
      assignedPickupSpot: {
        type: Sequelize.STRING,  // מקום הלקיחה המוקצה (אם קיים)
        allowNull: true,
      },
      requestSource: {
        type: Sequelize.ENUM('mobile', 'tablet'),  // ממכשיר נייד או טאבלט
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

    // הכנסת נתונים לדוגמה לטבלת RetrievalQueues
    await queryInterface.bulkInsert('RetrievalQueues', [
      {
        id: '1',
        sessionId: 'session123',
        userId: 'user001',
        licensePlate: 'ABC123',
        undergroundSpot: 'B1',
        requestedAt: new Date('2025-07-15T08:00:00'),
        estimatedTime: new Date('2025-07-15T08:15:00'),
        position: 1,
        status: 'queued',
        assignedPickupSpot: 'A1',
        requestSource: 'mobile',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        sessionId: 'session124',
        userId: 'user002',
        licensePlate: 'XYZ456',
        undergroundSpot: 'B2',
        requestedAt: new Date('2025-07-15T08:30:00'),
        estimatedTime: new Date('2025-07-15T08:45:00'),
        position: 2,
        status: 'processing',
        assignedPickupSpot: 'A2',
        requestSource: 'tablet',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('RetrievalQueues');  // מחיקת טבלת RetrievalQueues במקרה של חזרה אחורה
  }
};
