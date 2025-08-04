import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/databes'; // ייבוא קובץ ההגדרות של מסד הנתונים
import { BaseUser } from './baseUser';  // בהנחה שיש לך גם את BaseUser מוגדר

// טיפוסים עבור שדות AdminUser
interface AdminUserAttributes {
  id: number;
  baseUserId: number;
  passwordHash: string;
  role: 'hr' | 'admin';
  permissions: number;  // טיפוס INT
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

// אילו שדות אופציונליים ביצירה (id ו-lastLoginAt אוטומטיים)
interface AdminUserCreationAttributes extends Optional<AdminUserAttributes, 'id' | 'lastLoginAt'> {}

export class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes {

  public id!: number;
  public baseUserId!: number;
  public passwordHash!: string;
  public role!: 'hr' | 'admin';
  public permissions!: number;
  public lastLoginAt?: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;

  // קשרים אפשריים (או פונקציות עזר) יתווספו כאן

  static associate() {
    AdminUser.belongsTo(BaseUser, {
      foreignKey: 'baseUserId',
      as: 'baseUser',
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    });
  }
}

AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    baseUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      references: {
        model: 'BaseUser',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'NO ACTION',
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('hr', 'admin'),
      allowNull: false,
    },
    permissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
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
    }
  },
  {
    sequelize,
    tableName: 'AdminUsers',
    modelName: 'AdminUser',
    timestamps: false,
  }
);
