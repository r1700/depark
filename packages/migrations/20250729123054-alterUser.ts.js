'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Users', 'status');
    await queryInterface.removeColumn('Users', 'approvedAt');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('Users', 'status', {
      type: Sequelize.ENUM('pending', 'approved', 'declined', 'suspended'),
      allowNull: false,
      defaultValue: 'pending',
    });

    await queryInterface.addColumn('Users', 'approvedAt', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};
