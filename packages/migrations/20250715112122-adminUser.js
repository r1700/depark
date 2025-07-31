'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('adminusers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      baseuser_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      role: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=hr, 2=admin',
      },
      permissions: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      last_login_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });

    await queryInterface.bulkInsert('adminusers', [
      {
        baseuser_id: 1, 
        password_hash: 'hashed_password_1',
        role: 2, 
        permissions: ['read', 'write', 'delete'],
        last_login_at: null,
      },
      {
        baseuser_id: 2,
        password_hash: 'hashed_password_2',
        role: 1, // hr
        permissions: ['read', 'write'],
        last_login_at: new Date(),
      },
      {
        baseuser_id: 3,
        password_hash: 'hashed_password_3',
        role: 2, 
        permissions: ['read'],
        last_login_at: null,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('adminusers');
  },
};