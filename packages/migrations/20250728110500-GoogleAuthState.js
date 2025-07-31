'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('googlestates', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      baseuser_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=pending, 2=approved, 3=declined',
      },
      expires_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('googlestates', [
      {
        state: 'randomStateString1',
        baseuser_id: 1,
        email: 'user1@example.com',
        first_name: 'First1',
        last_name: 'Last1',
        status: 1,
        expires_at: new Date(Date.now() + 3600 * 1000), // נשאר תקף שעה
        created_at: new Date(),
      },
      {
        state: 'randomStateString2',
        baseuser_id: 2,
        email: 'user2@example.com',
        first_name: 'First2',
        last_name: 'Last2',
        status: 2,
        expires_at: new Date(Date.now() + 3600 * 1000),
        created_at: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('googlestates');
  }
};