import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/databes'; // ודאי שהנתיב נכון
// import  baseUser from './baseUser';

// הגדרת טיפוס TypeScript לשדות
export interface UserAttributes {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  department?: string;
  employeeId?: string;
  googleId?: string;
  status: 'pending' | 'approved' | 'declined' | 'suspended';
  maxCarsAllowedParking?: number;
  createdBy: string;
  approvedBy?: string;
  approvedAt?: Date;
}

// שדות שאפשר לא לשלוח ביצירה (id, createdAt, updatedAt וכו')
 interface UserCreationAttributes extends Optional<UserAttributes, 'id' | 'createdAt' | 'updatedAt' | 'approvedBy' | 'approvedAt' | 'department' | 'employeeId' | 'googleId' | 'maxCarsAllowedParking'> {}

export class User extends Model<UserAttributes, UserCreationAttributes> implements UserAttributes {
  public id!: string;
  public email!: string;
  public firstName!: string;
  public lastName!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
  public department?: string;
  public employeeId?: string;
  public googleId?: string;
  public status!: 'pending' | 'approved' | 'declined' | 'suspended';
  public maxCarsAllowedParking?: number;
  public createdBy!: string;
  public approvedBy?: string;
  public approvedAt?: Date;
}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
    },
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    department: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    employeeId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    googleId: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'approved', 'declined', 'suspended'),
      allowNull: false,
      defaultValue: 'pending',
    },
    maxCarsAllowedParking: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    createdBy: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    approvedBy: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    approvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: 'User',
    tableName: 'User',
    timestamps: true,
  }
);

