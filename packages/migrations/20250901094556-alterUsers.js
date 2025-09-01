'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'status');
    await queryInterface.removeColumn('users', 'approved_at');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'status', {
      type: Sequelize.INTEGER,
      allowNull: false,
      comment: '1=pending, 2=approved, 3=declined, 4=suspended',
    });

    await queryInterface.addColumn('users', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  }
};

