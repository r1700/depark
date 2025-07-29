'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('usagereports', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      report_type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=daily, 2=weekly, 3=monthly, 4=custom',
      },
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      generated_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      format: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=json, 2=csv, 3=pdf',
      },
      file_path: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      generated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    await queryInterface.bulkInsert('usagereports', [
      {
        report_type: 1,
        start_date: new Date('2025-07-01'),
        end_date: new Date('2025-07-01'),
        generated_by: 'user1',
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
        format: 1,
        file_path: 'path/to/file1.json',
        generated_at: new Date(),
      },
      {
        report_type: 2,
        start_date: new Date('2025-07-01'),
        end_date: new Date('2025-07-07'),
        generated_by: 'user2',
        data: JSON.stringify({
          totalSessions: 700,
          avgParkingDuration: 20,
          avgRetrievalTime: 12,
          peakHours: [
            { hour: 8, sessions: 100 },
            { hour: 9, sessions: 90 },
          ],
          utilizationRate: 80,
          totalEntries: 1400,
          totalExits: 1350,
        }),
        format: 2,
        file_path: 'path/to/file2.csv',
        generated_at: new Date(),
      },
      {
        report_type: 3,
        start_date: new Date('2025-07-01'),
        end_date: new Date('2025-07-31'),
        generated_by: 'user3',
        data: JSON.stringify({
          totalSessions: 3000,
          avgParkingDuration: 18,
          avgRetrievalTime: 14,
          peakHours: [
            { hour: 8, sessions: 400 },
            { hour: 9, sessions: 350 },
          ],
          utilizationRate: 85,
          totalEntries: 6000,
          totalExits: 5800,
        }),
        format: 3,
        file_path: 'path/to/file3.pdf',
        generated_at: new Date(),
      },
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('usagereports');
  },
};