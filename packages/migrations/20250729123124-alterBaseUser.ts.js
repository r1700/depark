'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('BaseUser', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('BaseUser', 'approvedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('BaseUser', 'status');
    await queryInterface.removeColumn('BaseUser', 'approvedAt');
  }
};
