'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UsageReports', { 
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      reportType: {
        type: Sequelize.ENUM('daily', 'weekly', 'monthly', 'custom'),
        allowNull: false,
      },
      startDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      endDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      generatedBy: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      format: {
        type: Sequelize.ENUM('json', 'csv', 'pdf'),
        allowNull: false,
      },
      filePath: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      generatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('UsageReports', [
      {
        id: '1',
        reportType: 'daily',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-01'),
        generatedBy: 'user1',
        data: JSON.stringify({
          totalSessions: 100,
          avgParkingDuration: 15,
          avgRetrievalTime: 10,
          peakHours: [
            { hour: 8, sessions: 50 },
            { hour: 9, sessions: 40 },
          ],
          utilizationRate: 75,
          totalEntries: 200,
          totalExits: 190,
        }),
        format: 'json',
        filePath: 'path/to/file1.json',
        generatedAt: new Date(),
      },
      {
        id: '2',
        reportType: 'monthly',
        startDate: new Date('2025-07-01'),
        endDate: new Date('2025-07-31'),
        generatedBy: 'user2',
        data: JSON.stringify({
          totalSessions: 3000,
          avgParkingDuration: 20,
          avgRetrievalTime: 12,
          peakHours: [
            { hour: 12, sessions: 300 },
            { hour: 18, sessions: 250 },
          ],
          utilizationRate: 85,
          totalEntries: 6000,
          totalExits: 5800,
        }),
        format: 'csv',
        filePath: 'path/to/file2.csv',
        generatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UsageReports');
  }
};
