'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('feedbackanswers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      session_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      question_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rating: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      submitted_at: {
        type: Sequelize.DATE,
        allowNull: false,
      }
    });
    await queryInterface.bulkInsert('feedbackanswers', [
      {
        session_id: 1,
        user_id: 1,
        question_id: 1,
        rating: 5,
        submitted_at: new Date('2023-08-10T08:17:40Z')
      },
      {
        session_id: 1,
        user_id: 1,
        question_id: 2,
        rating: 4,
        submitted_at: new Date('2023-08-10T08:17:40Z')
      },
    ]);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('feedbackquestions');
  }
};