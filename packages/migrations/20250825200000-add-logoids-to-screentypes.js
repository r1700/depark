module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.addColumn('ScreenTypes', 'logoIds', {
        type: Sequelize.ARRAY(Sequelize.INTEGER),
        allowNull: true
      });
    } catch (e) {
      // אם העמודה כבר קיימת, מתעלמים מהשגיאה
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('ScreenTypes', 'logoIds');
  }
};
