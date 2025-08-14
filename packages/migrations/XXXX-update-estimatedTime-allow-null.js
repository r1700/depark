'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('RetrievalQueues', 'estimatedTime', {
      type: Sequelize.DATE,
      allowNull: true, 
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('RetrievalQueues', 'estimatedTime', {
      type: Sequelize.DATE,
      allowNull: false, 
    });
  },
};
