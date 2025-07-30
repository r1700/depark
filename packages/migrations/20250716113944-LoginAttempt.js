'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('loginattempts', { 
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=user, 2=admin',
      },
      success: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      failure_reason: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('loginattempts', [
      {
        email: 'user@example.com',
        user_type: 1, 
        success: true,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        failure_reason: null,
        timestamp: new Date(),
      },
      {
        email: 'admin@example.com',
        user_type: 2, 
        success: false,
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0',
        failure_reason: 'Incorrect password',
        timestamp: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('loginattempts');
  }
};