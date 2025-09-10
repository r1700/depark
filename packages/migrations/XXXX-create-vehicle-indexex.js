


'use strict';

module.exports = {
  useTransaction: false,

  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS pg_trgm;`);

    await queryInterface.sequelize.query(`
     CREATE INDEX IF NOT EXISTS idx_vehicles_is_active_license_plate
ON vehicles (is_active, license_plate);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_is_currently_parked_license_plate
ON vehicles (is_currently_parked, license_plate);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_currently_parked_active_license_plate
ON vehicles (is_currently_parked, is_active, license_plate);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_license_plate
      ON vehicles (license_plate);
    `);


    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_baseuser_is_active_currently_parked
      ON vehicles (baseuser_id , is_active ,is_currently_parked);
    `);

    //connect vehicle_model_id with vehicles table
    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_model_id_active_currently_parked
ON vehicles(vehicle_model_id ,is_active, is_currently_parked);
    `);

    await queryInterface.sequelize.query(`
      CREATE INDEX IF NOT EXISTS idx_vehicles_vehicle_model_id_currently_parked
ON vehicles(vehicle_model_id , is_currently_parked);
    `);


  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_is_active_license_plate;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_is_currently_parked_license_plate;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_currently_parked_active_license_plate;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_license_plate;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_baseuser_is_active_currently_parked;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_vehicle_model_id_active_currently_parked;`);
    await queryInterface.sequelize.query(`DROP INDEX IF EXISTS idx_vehicles_vehicle_model_id_currently_parked;`);

    await queryInterface.sequelize.query(`DROP EXTENSION IF EXISTS pg_trgm;`);

  }
};