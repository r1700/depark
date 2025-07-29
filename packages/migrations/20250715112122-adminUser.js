'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AdminUsers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,  
      },
      passwordHash: {
        type: Sequelize.STRING,
        allowNull: false,  
      },
      role: {
        type: Sequelize.ENUM('hr', 'admin'),
        allowNull: false,  
      },
      permissions: {
        type: Sequelize.ARRAY(Sequelize.STRING),  
        allowNull: false,  
      },
      lastLoginAt: {
        type: Sequelize.DATE,
        allowNull: true,  
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('AdminUsers', [
      {
        passwordHash: 'hashed_password_1',
        role: 'admin',
        permissions: ['read', 'write', 'delete'],
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        passwordHash: 'hashed_password_2',
        role: 'hr',
        permissions: ['read', 'write'],
        lastLoginAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        passwordHash: 'hashed_password_3',
        role: 'admin',
        permissions: ['read'],
        lastLoginAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AdminUsers');  
  }
};