'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('GovernmentDataSync', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      syncDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      recordsProcessed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recordsAdded: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      recordsUpdated: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      errors: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM('completed', 'failed', 'partial'),
        allowNull: false,
      },
      triggeredBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      fileSource: {
        type: Sequelize.STRING,
        allowNull: true,
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

    await queryInterface.bulkInsert('GovernmentDataSync', [{
      id: 'sync_001',
      syncDate: new Date(),
      recordsProcessed: 100,
      recordsAdded: 75,
      recordsUpdated: 25,
      errors: null,
      status: 'completed',
      triggeredBy: 'admin_001',
      fileSource: '/path/to/file.csv',
      createdAt: new Date(),
      updatedAt: new Date(),
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('GovernmentDataSync', null, {});
    await queryInterface.dropTable('GovernmentDataSync');
  }
};
