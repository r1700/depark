'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('baseuser', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            first_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            last_name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            updated_at: {
                type: Sequelize.DATE,
                allowNull: false,
            }
        });

        await queryInterface.bulkInsert('baseuser', [
            {
                email: 'user1@example.com',
                first_name: 'John',
                last_name: 'Doe',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'user2@example.com',
                first_name: 'Jane',
                last_name: 'Smith',
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                email: 'user3@example.com',
                first_name: 'Alice',
                last_name: 'Johnson',
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('baseuser');
    }
};