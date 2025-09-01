module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Logos', {
      id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
      logoUrl: { type: Sequelize.STRING, allowNull: false },
        name: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        url: {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: null,
        },
        updatedAt: { type: Sequelize.DATE, allowNull: false },
        updatedBy: { type: Sequelize.STRING, allowNull: false }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Logos');
  }
};
