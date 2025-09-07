'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addIndex('users', ['id'], { name: 'idx_users_id_v2' });
    await queryInterface.addIndex('users', ['baseuser_id'], { name: 'idx_users_baseuser_id_v2' });
    await queryInterface.addIndex('users', ['department'], { name: 'idx_users_department_v2' });
    await queryInterface.addIndex('users', ['phone'], { name: 'idx_users_phone_v2' });
    await queryInterface.addIndex('users', ['status'], { name: 'idx_users_status_v2' });
    await queryInterface.addIndex('users', ['employee_id'], { name: 'idx_users_employee_id_v2' });
    await queryInterface.addIndex('users', ['max_cars_allowed_parking'], { name: 'idx_users_max_cars_allowed_parking_v2' });
    await queryInterface.addIndex('users', ['created_by'], { name: 'idx_users_created_by_v2' });
    await queryInterface.addIndex('users', ['approved_by'], { name: 'idx_users_approved_by_v2' });
    await queryInterface.addIndex('users', ['approved_at'], { name: 'idx_users_approved_at_v2' });
    await queryInterface.addIndex('users', ['google_id'], { name: 'idx_users_google_id_v2' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'idx_users_id_v2');
    await queryInterface.removeIndex('users', 'idx_users_baseuser_id_v2');
    await queryInterface.removeIndex('users', 'idx_users_department_v2');
    await queryInterface.removeIndex('users', 'idx_users_phone_v2');
    await queryInterface.removeIndex('users', 'idx_users_status_v2');
    await queryInterface.removeIndex('users', 'idx_users_employee_id_v2');
    await queryInterface.removeIndex('users', 'idx_users_max_cars_allowed_parking_v2');
    await queryInterface.removeIndex('users', 'idx_users_created_by_v2');
    await queryInterface.removeIndex('users', 'idx_users_approved_by_v2');
    await queryInterface.removeIndex('users', 'idx_users_approved_at_v2');
    await queryInterface.removeIndex('users', 'idx_users_google_id_v2');
  }
};