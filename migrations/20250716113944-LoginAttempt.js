'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('LoginAttempts', {  // שם הטבלה: LoginAttempts
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      userType: {
        type: Sequelize.ENUM('user', 'admin'),  
        allowNull: false,
      },
      success: {
        type: Sequelize.BOOLEAN,  
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      userAgent: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      failureReason: {
        type: Sequelize.STRING,  
        allowNull: true,  
      },
      timestamp: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('LoginAttempts', [
      {
        id: '1',
        email: 'user@example.com',
        userType: 'user',
        success: true,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        failureReason: null,
        timestamp: new Date(),
      },
      {
        id: '2',
        email: 'admin@example.com',
        userType: 'admin',
        success: false,
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
        failureReason: 'Incorrect password',
        timestamp: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    console.log("down");
    await queryInterface.dropTable('LoginAttempts');  
  }
};
