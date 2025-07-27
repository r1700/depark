'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ParkingUsageStats', {
      id: {
        type: Sequelize.STRING,  
        primaryKey: true,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,  
        allowNull: false,
      },
      hour: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      totalParkedCars: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      avgRetrievalTime: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      maxQueueLength: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      peakUsageTime: {
        type: Sequelize.STRING,  
        allowNull: false,
      },
      utilizationPercentage: {
        type: Sequelize.FLOAT,  
        allowNull: false,
      },
      totalEntries: {
        type: Sequelize.INTEGER,  
        allowNull: false,
      },
      totalExits: {
        type: Sequelize.INTEGER,  
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
    });

    await queryInterface.bulkInsert('ParkingUsageStats', [
      {
        id: '1',
        date: new Date('2025-07-15'),
        hour: 7,
        totalParkedCars: 30,
        avgRetrievalTime: 5,
        maxQueueLength: 10,
        peakUsageTime: '08:00',
        utilizationPercentage: 85.5,
        totalEntries: 50,
        totalExits: 40,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        date: new Date('2025-07-15'),
        hour: 8,
        totalParkedCars: 35,
        avgRetrievalTime: 7,
        maxQueueLength: 12,
        peakUsageTime: '09:00',
        utilizationPercentage: 90.3,
        totalEntries: 60,
        totalExits: 55,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ParkingUsageStats');
  }
};
