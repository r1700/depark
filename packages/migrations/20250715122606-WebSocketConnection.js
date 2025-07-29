'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('websocketconnections', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      baseuser_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      connection_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=mobile, 2=tablet',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      connected_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      last_activity: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
    });

    await queryInterface.bulkInsert('websocketconnections', [
      {
        baseuser_id: 1,
        connection_type: 1,
        is_active: true,
        connected_at: new Date(),
        last_activity: new Date(),
        ip_address: '192.168.1.1',
 
      },
      {
        baseuser_id: 2,
        connection_type: 2,
        is_active: true,
        connected_at: new Date(),
        last_activity: new Date(),
        ip_address: '192.168.1.2',
 
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('websocketconnections');
  }
};