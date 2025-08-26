
import { Sequelize, DataTypes, Model } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();
import sequelize from '../../config/instance';

// export const sequelize = new Sequelize({
//     dialect: 'postgres', // שנה לפי הצורך
//     host: process.env.HOST_DB,
//     username: process.env.USER_DB,
//     password: process.env.PASSWORD_DB,
//     database: process.env.DATABASE_DB,
//     logging: false,
// });


// --- Model User ---
export class User extends Model {
    public id!: string;

    public email!: string;
    public firstName!: string;
    public lastName!: string;
    public department!: string;
    public employeeId!: string;
    public googleId!: string;
    public status!: string;
    public maxCarsAllowedParking!: number;
    public createdBy!: string;
    public approvedBy!: string;
    public approvedAt!: Date;
    public createdAt!: Date;
    public updatedAt!: Date;
    public phone!: string;
}

User.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,

        },
        email: { type: DataTypes.STRING, allowNull: false },
        firstName: DataTypes.STRING,
        lastName: DataTypes.STRING,
        department: DataTypes.STRING,
        employeeId: DataTypes.STRING,
        googleId: DataTypes.STRING,
        status: DataTypes.STRING,
        maxCarsAllowedParking: DataTypes.INTEGER,
        createdBy: DataTypes.STRING,
        approvedBy: DataTypes.STRING,
        approvedAt: DataTypes.DATE,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updatedAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        phone: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'Users',
        timestamps: true,
    }
);

// --- Model UserSession ---
export class UserSession extends Model {
    public id!: string;
    public userId!: string;
    public userType!: string;
    public token!: string;
    public refreshToken!: string;
    public expiresAt!: Date;
    public isActive!: boolean;
    public ipAddress!: string;
    public userAgent!: string;
    public createdAt!: Date;
    public lastActivity!: Date;
    public tempToken!: string;
}

UserSession.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,

        },
        userId: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        userType: DataTypes.STRING,
        token: DataTypes.STRING,
        refreshToken: DataTypes.STRING,
        expiresAt: DataTypes.DATE,
        isActive: DataTypes.BOOLEAN,
        ipAddress: DataTypes.STRING,
        userAgent: DataTypes.STRING,
        createdAt: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        lastActivity: DataTypes.DATE,
        tempToken: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'UserSessions',
        timestamps: false,
    }
);

// קשרים
User.hasMany(UserSession, { foreignKey: 'userId' });
UserSession.belongsTo(User, { foreignKey: 'userId' });

export default sequelize;
