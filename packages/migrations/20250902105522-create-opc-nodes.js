'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('opc_nodes', {
      id: { type: Sequelize.INTEGER, primaryKey: true, autoIncrement: true, allowNull: false },

      
      node_name: { type: Sequelize.STRING(255), allowNull: false },

      node_id:   { type: Sequelize.STRING(512), allowNull: false },

      description: { type: Sequelize.TEXT, allowNull: true },

      created_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') },
      updated_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.fn('NOW') }
    });

    await queryInterface.addIndex('opc_nodes', ['node_name'], {
      unique: true,
      name: 'ux_opc_nodes_node_name'
    });

    await queryInterface.addIndex('opc_nodes', ['node_id'], {
      name: 'ix_opc_nodes_node_id'
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('opc_nodes');
  }
};
