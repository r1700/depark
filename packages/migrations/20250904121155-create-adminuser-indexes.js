'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('adminusers', ['baseuser_id'], { name: 'idx_adminuser_baseuser_id' });
    await queryInterface.addIndex('adminusers', ['role'], { name: 'idx_adminuser_role' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('adminusers', 'idx_adminuser_baseuser_id');
    await queryInterface.removeIndex('adminusers', 'idx_adminuser_role');
  }
};