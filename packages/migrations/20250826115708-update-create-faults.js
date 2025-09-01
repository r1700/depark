'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      // 1) עדכון שורות קיימות: ממלאים phone ריק במקום NULL כדי לאפשר שינוי לא NOT NULL
      await queryInterface.sequelize.query(
        `UPDATE technicians SET phone = '' WHERE phone IS NULL;`,
        { transaction: t }
      );

      // 2) משנה את עמודת phone ל-NOT NULL
      await queryInterface.changeColumn(
        'technicians',
        'phone',
        {
          type: Sequelize.STRING(50),
          allowNull: false,
          comment: 'Technician phone (required)',
        },
        { transaction: t }
      );

      // 3) מסיר את עמודות created_at ו-updated_at
      // חשוב: פעולה זו מוחקת את הערכים; גיבוי אם הם חשובים.
      await queryInterface.removeColumn('technicians', 'created_at', { transaction: t });
      await queryInterface.removeColumn('technicians', 'updated_at', { transaction: t });
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      // 1) החזרת created_at ו-updated_at
      await queryInterface.addColumn(
        'technicians',
        'created_at',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          comment: 'Record creation timestamp',
        },
        { transaction: t }
      );

      await queryInterface.addColumn(
        'technicians',
        'updated_at',
        {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
          comment: 'Record last update timestamp',
        },
        { transaction: t }
      );

      // 2) מחזיר את phone להיות nullable שוב
      await queryInterface.changeColumn(
        'technicians',
        'phone',
        {
          type: Sequelize.STRING(50),
          allowNull: true,
          comment: 'Technician phone (optional)',
        },
        { transaction: t }
      );
    });
  },
};