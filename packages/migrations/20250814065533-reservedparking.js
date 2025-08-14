'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('reservedparking', {
     id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      adminusersId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'adminusers'
        }
      },
      parking_number: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'מספר חניה',
      },
      day_of_week: {
        type: Sequelize.STRING,
        allowNull: false,
        comment: 'יום בשבוע',
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('reservedparking');
  }
};

