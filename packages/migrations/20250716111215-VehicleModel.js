'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('VehicleModels', {
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
      yearRange: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      dimensions: {
        type: Sequelize.JSONB,  
        allowNull: false,
      },
      source: {
        type: Sequelize.ENUM('manual', 'government_db', 'hr_input'),  
        allowNull: false,
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
      updatedBy: {
        type: Sequelize.STRING,  
        allowNull: true,
      },
    });

    await queryInterface.bulkInsert('VehicleModels', [
      {
        id: '1',
        make: 'Toyota',
        model: 'Corolla',
        yearRange: JSON.stringify({ start: 2000, end: 2020 }), 
        dimensions: JSON.stringify({ length: 4.63, width: 1.78, height: 1.43 }), 
        source: 'manual',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'admin',
      },
      {
        id: '2',
        make: 'Ford',
        model: 'Focus',
        yearRange: JSON.stringify({ start: 2005, end: 2021 }), 
        dimensions: JSON.stringify({ length: 4.37, width: 1.82, height: 1.46 }), 
        source: 'government_db',
        createdAt: new Date(),
        updatedAt: new Date(),
        updatedBy: 'admin',
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('VehicleModels');
  }
};
