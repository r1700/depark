'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SystemSettings', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      key: {
        type: Sequelize.STRING,  
        allowNull: false,
        unique: true,  
      },
      value: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      category: {
        type: Sequelize.ENUM('parking', 'auth', 'notifications', 'integration', 'government_db'),  // קטגוריה של ההגדרה
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
      updatedBy: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('SystemSettings', [
      {
        id: '1',
        key: 'maxParkingTime',
        value: '120', 
        description: 'Max time a vehicle can park in the facility',
        category: 'parking',
        updatedAt: new Date(),
        updatedBy: 'admin1',
      },
      {
        id: '2',
        key: 'authTimeout',
        value: '30', 
        description: 'Timeout for user authentication session',
        category: 'auth',
        updatedAt: new Date(),
        updatedBy: 'admin2',
      },
      {
        id: '3',
        key: 'notificationEmail',
        value: 'support@example.com',
        description: 'Email address for system notifications',
        category: 'notifications',
        updatedAt: new Date(),
        updatedBy: 'admin3',
      },
      {
        id: '4',
        key: 'integrationEnabled',
        value: 'true', 
        description: 'Is system integration enabled',
        category: 'integration',
        updatedAt: new Date(),
        updatedBy: 'admin4',
      },
      {
        id: '5',
        key: 'govSyncInterval',
        value: '3600', 
        description: 'Interval between government database syncs',
        category: 'government_db',
        updatedAt: new Date(),
        updatedBy: 'admin5',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('SystemSettings');  
  }
};
