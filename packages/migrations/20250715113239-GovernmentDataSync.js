'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('governmentdatasync', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      sync_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      records_processed: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      records_added: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      records_updated: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      errors: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=completed, 2=failed, 3=partial',
      },
      triggered_by: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      file_source: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });

    await queryInterface.bulkInsert('governmentdatasync', [{
      sync_date: new Date(),
      records_processed: 100,
      records_added: 75,
      records_updated: 25,
      errors: null,
      status: 1,  
      triggered_by: 'admin_001',
      file_source: '/path/to/file.csv',
    }], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('governmentdatasync', null, {});
    await queryInterface.dropTable('governmentdatasync');
  }
};