'use strict';

module.exports = {
  // פונקציית up – מוסיפה עמודה לטבלה
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn( // פעולה להוספת עמודה
      'UserSessions',                      // שם הטבלה
      'temporaryToken',           // שם העמודה החדשה
      {
        type: Sequelize.STRING,    // סוג הנתונים – מחרוזת
        allowNull: true,           // מאפשר ערכים null
      }
    );
  },

  // פונקציית down – מוחקת את העמודה במקרה של ביטול מיגרציה
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn( // פעולה למחיקת עמודה
      'UserSessions',                         // שם הטבלה
      'temporaryToken'               // שם העמודה למחיקה
    );
  }
};
