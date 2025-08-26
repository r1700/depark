'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
      await queryInterface.sequelize.query(`
      ALTER TABLE "baseuser" ADD COLUMN IF NOT EXISTS "phone" VARCHAR NULL;
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "usersessions" ADD COLUMN IF NOT EXISTS "temp_token" VARCHAR NULL;
    `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      ALTER TABLE "baseuser" DROP COLUMN IF EXISTS "phone";
    `);
    await queryInterface.sequelize.query(`
      ALTER TABLE "usersessions" DROP COLUMN IF EXISTS "temp_token";
    `);
  },
};
