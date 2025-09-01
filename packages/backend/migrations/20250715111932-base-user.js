'use strict';
console.log('lllllllllllll');

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('BaseUser', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            firstName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            lastName: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            createdAt: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updatedAt: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });

        await queryInterface.bulkInsert('BaseUser', [
            {
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'user2@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
                createdAt: new Date(),
                updatedAt: new Date()
            },
            {
                email: 'user3@example.com',
                firstName: 'Alice',
                lastName: 'Johnson',
                createdAt: new Date(),
                updatedAt: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('BaseUser');
    }
};