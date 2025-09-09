'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('baseuser', ['id'], { name: 'idx_baseuser_id' });
    await queryInterface.addIndex('baseuser', ['first_name'], { name: 'idx_baseuser_first_name' });
    await queryInterface.addIndex('baseuser', ['last_name'], { name: 'idx_baseuser_last_name' });
    await queryInterface.addIndex('baseuser', ['email'], { name: 'idx_baseuser_email' });
    await queryInterface.addIndex('users', ['google_id'], { name: 'idx_users_google_id' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('baseuser', 'idx_baseuser_id');
    await queryInterface.removeIndex('baseuser', 'idx_baseuser_first_name');
    await queryInterface.removeIndex('baseuser', 'idx_baseuser_last_name');
    await queryInterface.removeIndex('baseuser', 'idx_baseuser_email');
    await queryInterface.removeIndex('users', 'idx_users_google_id');

  }
};