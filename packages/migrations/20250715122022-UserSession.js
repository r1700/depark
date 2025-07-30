'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usersessions', {
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
        comment: '1=user, 2=admin',
      },
      token: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      refresh_token: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      ip_address: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      user_agent: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      last_activity: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('usersessions', [
      {

        baseuser_id: 1,
        user_type: 1,
        token: 'token12345',
        refresh_token: 'refreshToken123',
        expires_at: new Date(Date.now() + 3600 * 1000),
        is_active: true,
        ip_address: '192.168.1.1',
        user_agent: 'Mozilla/5.0',
        created_at: new Date(),
        last_activity: new Date(),
      },
      {
        baseuser_id: 2,
        user_type: 2,
        token: 'token67890',
        refresh_token: 'refreshToken456',
        expires_at: new Date(Date.now() + 3600 * 1000),
        is_active: true,
        ip_address: '192.168.1.2',
        user_agent: 'Chrome/91.0',
        created_at: new Date(),
        last_activity: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usersessions');
  },
};