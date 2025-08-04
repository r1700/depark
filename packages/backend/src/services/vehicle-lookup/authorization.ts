
// בס"ד

import { Model, DataTypes } from 'sequelize';
import { sequelize } from '../../config/sequelize.config';

export class User extends Model {
    public id!: number;
    public baseuser_id!: number;
    public max_cars_allowed_parking!: number;
}

export class ParkingSessions extends Model {
    public id!: number;
    public baseuser_id!: number;
    //   public vehicle_id!: number;
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    baseuser_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    max_cars_allowed_parking: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1, // Default to 1 car allowed
    },
}, {
    sequelize,
    tableName: 'users',
    modelName: 'User',
    timestamps: false,
});

ParkingSessions.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    baseuser_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
}, {
    sequelize,
    tableName: 'parkingsessions',
    modelName: 'ParkingSessions',
    timestamps: false,
});

const canUserPark = async (baseuser_id: number): Promise<boolean> => {
  try {
    // שלב 1 – כמה רכבים חונים כעת למשתמש
    const activeSessionsCount = await ParkingSessions.count({
      where: { baseuser_id }
    });

    // שלב 2 – כמה מותר לו להחנות
    const user = await User.findOne({
      where: { baseuser_id }
    });

    if (!user) {
      console.error('User not found');
      return false;
    }

    return activeSessionsCount < user.max_cars_allowed_parking;
  } catch (err) {
    console.error('Error checking parking availability', err);
    return false;
  }
};

canUserPark()