'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UnknownVehicleModels', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      make: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      model: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      requestCount: {
        type: Sequelize.INTEGER,  
        allowNull: false,
        defaultValue: 0,  
      },
      lastRequested: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
      status: {
        type: Sequelize.ENUM('pending_review', 'resolved', 'ignored'),  
        allowNull: false,
      },
      resolvedBy: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      resolvedAt: {
        type: Sequelize.DATE,  
        allowNull: true,
      },
      resolvedVehicleModelId: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,  
        allowNull: false,
        defaultValue: Sequelize.NOW,  
      },
    });

    await queryInterface.bulkInsert('UnknownVehicleModels', [
      {
        id: '1',
        make: 'Toyota',
        model: 'Corolla',
        requestCount: 3,
        lastRequested: new Date(),
        status: 'pending_review',
        createdAt: new Date(),
      },
      {
        id: '2',
        make: 'Honda',
        model: 'Civic',
        requestCount: 5,
        lastRequested: new Date(),
        status: 'resolved',
        resolvedBy: 'admin1',
        resolvedAt: new Date(),
        resolvedVehicleModelId: 'H123',
        createdAt: new Date(),
      },
      {
        id: '3',
        make: 'Ford',
        model: 'Focus',
        requestCount: 2,
        lastRequested: new Date(),
        status: 'ignored',
        createdAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UnknownVehicleModels');  
  }
};
