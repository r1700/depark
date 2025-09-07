'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('usersessions', ['token'], { name: 'idx_usersession_token' });
    await queryInterface.addIndex('usersessions', ['baseuser_id'], { name: 'idx_usersession_baseuser_id' });
    await queryInterface.addIndex('usersessions', ['is_active'], { name: 'idx_usersession_is_active' });
    await queryInterface.addIndex('usersessions', ['expires_at'], { name: 'idx_usersession_expires_at' });
    await queryInterface.addIndex('usersessions', ['last_activity'], { name: 'idx_usersession_last_activity' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('usersessions', 'idx_usersession_token');
    await queryInterface.removeIndex('usersessions', 'idx_usersession_baseuser_id');
    await queryInterface.removeIndex('usersessions', 'idx_usersession_is_active');
    await queryInterface.removeIndex('usersessions', 'idx_usersession_expires_at');
    await queryInterface.removeIndex('usersessions', 'idx_usersession_last_activity');
  }
};