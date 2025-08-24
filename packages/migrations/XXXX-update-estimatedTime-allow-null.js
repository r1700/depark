'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('retrievalqueues', 'estimated_time', {
      type: Sequelize.DATE,
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('retrievalqueues', 'estimated_time', {
      type: Sequelize.DATE,
      allowNull: false, 
    });
  },
};
