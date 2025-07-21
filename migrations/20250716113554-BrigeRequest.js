'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('BridgeRequest', {
      id: {
        type: Sequelize.STRING,
        primaryKey: true,
        allowNull: false,
      },
      type: {
        type: Sequelize.ENUM('vehicle_lookup', 'store_location', 'retrieval_request', 'queue_status'),
        allowNull: false,
      },
      payload: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'sent', 'acknowledged', 'failed'),
        allowNull: false,
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      acknowledgedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      response: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      retryCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      maxRetries: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      error: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });

    // הכנסת נתונים לדוגמה עם JSONB
    await queryInterface.bulkInsert('BridgeRequest', [
      {
        id: '1',
        type: 'vehicle_lookup',
        payload: JSON.stringify({ licensePlate: 'ABC123', vehicleModel: 'ModelX' }),
        status: 'pending',
        sentAt: new Date(),
        acknowledgedAt: null,
        response: null,
        retryCount: 0,
        maxRetries: 3,
        error: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: '2',
        type: 'retrieval_request',
        payload: JSON.stringify({ licensePlate: 'XYZ456', vehicleModel: 'ModelY' }),
        status: 'sent',
        sentAt: new Date(),
        acknowledgedAt: null,
        response: JSON.stringify({ message: 'Request acknowledged' }),
        retryCount: 1,
        maxRetries: 3,
        error: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('BridgeRequest');
  }
};
