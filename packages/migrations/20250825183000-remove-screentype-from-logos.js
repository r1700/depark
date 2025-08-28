module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeColumn('Logos', 'screenType');
    } catch (e) {
      // אם העמודה לא קיימת, מתעלמים מהשגיאה
    }
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Logos', 'screenType', {
      type: Sequelize.STRING,
      allowNull: true, // חשוב שיהיה allowNull: true
      defaultValue: null
    });
  }
};
