
'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('baseuser', 'status', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.addColumn('baseuser', 'approved_at', {
      type: Sequelize.DATE,
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('baseuser', 'status');
    await queryInterface.removeColumn('baseuser', 'approved_at');
  }
};

