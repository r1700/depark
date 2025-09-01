module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ScreenTypes', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      name: {
        type: Sequelize.ENUM('CRM', 'mobile', 'tablet'),
        allowNull: false,
        unique: true
      },
      logoIds: {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      }
    });
    // Add foreign key constraint for each logoId in logoIds array
    // Note: Sequelize migration does not support array foreign keys directly, so you must enforce this in application/model logic
    // Insert the 3 rows
    await queryInterface.bulkInsert('ScreenTypes', [
  { name: 'CRM', logoIds: Sequelize.literal('ARRAY[]::INTEGER[]') },
  { name: 'mobile', logoIds: Sequelize.literal('ARRAY[]::INTEGER[]') },
  { name: 'tablet', logoIds: Sequelize.literal('ARRAY[]::INTEGER[]') }
    ]);
  },
  down: async (queryInterface, Sequelize) => {
  await queryInterface.dropTable('ScreenTypes');
  await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_ScreenTypes_name";');
  }
};
