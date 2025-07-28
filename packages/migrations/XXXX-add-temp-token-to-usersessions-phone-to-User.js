'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('UserSessions', 'tempToken', {
      type: Sequelize.STRING,
      allowNull: true,
    });


     await queryInterface.addColumn('Users', 'phone', {
      type: Sequelize.STRING,      
      allowNull: true,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('UserSessions', 'tempToken');
    await queryInterface.removeColumn('Users', 'phone');
  },
};
