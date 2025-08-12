
// בס"ד

import { Model, DataTypes } from 'sequelize';
import  sequelize  from '../../config/sequelize'

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
    // how many active parking sessions does the user have?
    const activeSessionsCount = await ParkingSessions.count({
      where: { baseuser_id }
    });

    // how many cars is the user allowed to park?
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

// canUserPark(1)
// .then(canPark => {
//   console.log(`User can park: ${canPark}`);
// })
// .catch(err => { 
//   console.error('Error checking if user can park:', err);
// }); 

export default canUserPark;