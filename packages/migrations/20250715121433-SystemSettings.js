'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('systemsettings', {
      id: {
        type: Sequelize.INTEGER,  
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
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
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=parking, 2=auth, 3=notifications, 4=integration, 5=government_db',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updated_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('systemsettings', [
      {
        key: 'maxParkingTime',
        value: '120',
        description: 'Max time a vehicle can park in the facility',
        category: 1, 
        updated_at: new Date(),
        updated_by: 'admin1',
      },
      {
        key: 'authTimeout',
        value: '30',
        description: 'Timeout for user authentication session',
        category: 2, 
        updated_at: new Date(),
        updated_by: 'admin2',
      },
      {
        key: 'notificationEmail',
        value: 'support@example.com',
        description: 'Email address for system notifications',
        category: 3, // notifications
        updated_at: new Date(),
        updated_by: 'admin3',
      },
      {
        key: 'integrationEnabled',
        value: 'true',
        description: 'Is system integration enabled',
        category: 4,
        updated_at: new Date(),
        updated_by: 'admin4',
      },
      {
        key: 'govSyncInterval',
        value: '3600',
        description: 'Interval between government database syncs',
        category: 5, 
        updated_at: new Date(),
        updated_by: 'admin5',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('systemsettings');
  },
};