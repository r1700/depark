'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('User', 'status');
    await queryInterface.removeColumn('User', 'approvedAt');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('User', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'declined', 'suspended'),
      allowNull: false,
      defaultValue: 'pending',
    });

    await queryInterface.addColumn('User', 'approvedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
