'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if the 'phone' column exists before adding it
    const tableDescription = await queryInterface.describeTable('users');
    if (!tableDescription.phone) {
      await queryInterface.addColumn('users', 'phone', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    // Add indexes if they don't already exist
    const existingIndexes = await queryInterface.showIndex('users');

    const addIndexIfNotExists = async (indexName, columns) => {
      if (!existingIndexes.some(index => index.name === indexName)) {
        await queryInterface.addIndex('users', columns, { name: indexName });
      }
    };

    await addIndexIfNotExists('idx_users_id_v2', ['id']);
    await addIndexIfNotExists('idx_users_baseuser_id_v2', ['baseuser_id']);
    await addIndexIfNotExists('idx_users_department_v2', ['department']);
    await addIndexIfNotExists('idx_users_phone_v2', ['phone']);
    await addIndexIfNotExists('idx_users_status_v2', ['status']);
    await addIndexIfNotExists('idx_users_employee_id_v2', ['employee_id']);
    await addIndexIfNotExists('idx_users_max_cars_allowed_parking_v2', ['max_cars_allowed_parking']);
    await addIndexIfNotExists('idx_users_created_by_v2', ['created_by']);
    await addIndexIfNotExists('idx_users_approved_by_v2', ['approved_by']);
    await addIndexIfNotExists('idx_users_approved_at_v2', ['approved_at']);
    await addIndexIfNotExists('idx_users_google_id_v2', ['google_id']);
  },

  async down(queryInterface, Sequelize) {
    // Remove the 'phone' column
    const tableDescription = await queryInterface.describeTable('users');
    if (tableDescription.phone) {
      await queryInterface.removeColumn('users', 'phone');
    }

    // Remove indexes
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