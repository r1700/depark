'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('bridgerequest', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
      },
      type: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=vehicle_lookup, 2=store_location, 3=retrieval_request, 4=queue_status',
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '1=pending, 2=sent, 3=acknowledged, 4=failed',
      },
      sent_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      acknowledged_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      response: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      retry_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      max_retries: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      error: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    
    });

  await queryInterface.bulkInsert('bridgerequest', [
  {
    type: 1, 
    payload: JSON.stringify({ licensePlate: 'ABC123', vehicleModel: 'ModelX' }),
    status: 1, 
    sent_at: new Date(),
    acknowledged_at: null,
    response: null,
    retry_count: 0,
    max_retries: 3,
    error: null,
   
  },
  {
    type: 3, 
    payload: JSON.stringify({ licensePlate: 'XYZ456', vehicleModel: 'ModelY' }),
    status: 2, 
    sent_at: new Date(),
    acknowledged_at: null,
    response: JSON.stringify({ message: 'Request acknowledged' }),
    retry_count: 1,
    max_retries: 3,
    error: null,
 
  },
]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('bridgerequest');
  }
};