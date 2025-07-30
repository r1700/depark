'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('useractivities', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      baseuser_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=hr, 2=admin, 3=employee, 4=anonymous',
      },
      action: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      details: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        allowNull: false,
      },


    });

    await queryInterface.bulkInsert('useractivities', [
      {
        baseuser_id: 1,
        user_type: 2,
        action: 'login',
        details: JSON.stringify({ success: true }),
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        timestamp: new Date(),
       
      },
      {
       baseuser_id: 2,
        user_type: 3,
        action: 'update_profile',
        details: JSON.stringify({ field: 'email', oldValue: 'user@old.com', newValue: 'user@new.com' }),
        ip_address: '192.168.1.2',
        user_agent: 'Mozilla/5.0',
        timestamp: new Date(),
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('useractivities');
  }
};