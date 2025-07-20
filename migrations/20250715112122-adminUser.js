'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AdminUsers', {  // שמו של הטבלה: AdminUsers
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,  // יצירת מזהה אוטומטי
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,  // חייב להיות מלא
      },
      role: {
        type: Sequelize.ENUM('hr', 'admin'),
        allowNull: false,  // חובה להגדיר את התפקיד
      },
      permissions: {
        type: Sequelize.ARRAY(Sequelize.STRING),  // מערך של מיתר
        allowNull: false,  // חובה להגדיר הרשאות
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,  // אופציונלי, יכול להיות NULL
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

    // Insert data into AdminUsers
    await queryInterface.bulkInsert('AdminUsers', [
      {
        passwordHash: 'hashed_password_1',
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        passwordHash: 'hashed_password_2',
        role: 'hr',
        permissions: ['read', 'write'],
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        passwordHash: 'hashed_password_3',
        role: 'admin',
        permissions: ['read'],
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AdminUsers');  // מחיקת טבלת AdminUsers במקרה של חזרה אחורה
  }
};