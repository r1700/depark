'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UserActivities', { 
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      userType: {
        type: Sequelize.ENUM('hr', 'admin', 'employee', 'anonymous'),  
        allowNull: false,
      },
      action: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      details: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      ipAddress: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      userAgent: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,  
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

    await queryInterface.bulkInsert('UserActivities', [
      {
        id: '1',
        userId: 'user123',
        userType: 'admin',
        action: 'login',
        details: JSON.stringify({ success: true }),
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        userId: 'user456',
        userType: 'employee',
        action: 'update_profile',
        details: JSON.stringify({ field: 'email', oldValue: 'user@old.com', newValue: 'user@new.com' }),
        ipAddress: '192.168.1.2',
        userAgent: 'Mozilla/5.0',
        timestamp: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UserActivities');
  }
};
