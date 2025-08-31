module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create join table for ScreenType <-> Logo (recommended for קשר רבים-לרבים)
    await queryInterface.createTable('ScreenTypeLogos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      screenTypeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'ScreenTypes',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      logoId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Logos',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ScreenTypeLogos');
  }
};
