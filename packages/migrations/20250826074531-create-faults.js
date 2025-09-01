'use strict';

module.exports = {
async up(queryInterface, Sequelize) {
return queryInterface.sequelize.transaction(async (t) => {
// 1) Create technicians table
await queryInterface.createTable(
'technicians',
{
id: {
type: Sequelize.INTEGER,
primaryKey: true,
autoIncrement: true,
allowNull: false,
comment: 'Primary key',
},
name: {
type: Sequelize.STRING(150),
allowNull: false,
comment: 'Technician full name',
},
email: {
type: Sequelize.STRING(150),
allowNull: true,
comment: 'Technician email (optional)',
},
phone: {
type: Sequelize.STRING(50),
allowNull: true,
comment: 'Technician phone (optional)',
},
created_at: {
type: Sequelize.DATE,
allowNull: false,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
comment: 'Record creation timestamp',
},
updated_at: {
type: Sequelize.DATE,
allowNull: false,
defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
comment: 'Record last update timestamp',
},
},
{ transaction: t }
);


  // 2) Create faults table (snake_case names)
  await queryInterface.createTable(
    'faults',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        comment: 'Primary key - fault id',
      },
      parking_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Parking identifier',
      },
      fault_description: {
        type: Sequelize.TEXT,
        allowNull: true,
        comment: 'Descriptive text of the fault',
      },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'resolved'),
        allowNull: false,
        defaultValue: 'open',
        comment: 'Fault status: open / in_progress / resolved',
      },
      severity: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        allowNull: false,
        defaultValue: 'medium',
        comment: 'Fault severity: low / medium / high',
      },
      resolved_at: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: 'Timestamp when the fault was marked resolved',
      },
      assignee_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        comment: 'FK to technicians.id - person assigned (nullable)',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record creation timestamp (managed by Sequelize)',
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        comment: 'Record update timestamp (managed by Sequelize)',
      },
    },
    { transaction: t }
  );

  // 3) Indexes
  await queryInterface.addIndex('faults', ['parking_id'], { name: 'idx_faults_parking_id', transaction: t });
  await queryInterface.addIndex('faults', ['status'], { name: 'idx_faults_status', transaction: t });
  await queryInterface.addIndex('faults', ['severity'], { name: 'idx_faults_severity', transaction: t });
  await queryInterface.addIndex('faults', ['assignee_id'], { name: 'idx_faults_assignee_id', transaction: t });

  // 4) Foreign key: faults.assignee_id -> technicians.id
await queryInterface.addConstraint('faults', {
fields: ['assignee_id'],
type: 'foreign key',
name: 'fk_faults_assignee_technicians',
references: { table: 'technicians', field: 'id' },
onDelete: 'SET NULL',
onUpdate: 'CASCADE',
transaction: t
});

});
},

async down(queryInterface, Sequelize) {
return queryInterface.sequelize.transaction(async (t) => {
// remove FK constraint (defensive)
await queryInterface.removeConstraint('faults', 'fk_faults_assignee_technicians', { transaction: t }).catch(() => {});


  // drop faults first
  await queryInterface.dropTable('faults', { transaction: t });

  // drop technicians
  await queryInterface.dropTable('technicians', { transaction: t });

  // If Postgres: drop enum types that Sequelize created for the columns
  if (queryInterface.sequelize.getDialect() === 'postgres') {
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_faults_status";', { transaction: t });
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_faults_severity";', { transaction: t });
  }
});
},
};