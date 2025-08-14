import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// ממשק טיפוס המאפיינים של AdminUser
export interface AdminUserAttributes {
  id: number;
  baseUserId: number;
  passwordHash: string;
  role: 'hr' | 'admin';
  lastLoginAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
  permissions: number;
}

// בשביל יצירת רשומה חדשה, חלק מהשדות אופציונליים (למשל id)
export interface AdminUserCreationAttributes extends Optional<AdminUserAttributes, 'id' | 'lastLoginAt'> {}

// מחלקת המודל עצמה עם הטיפוסים שצוינו
export class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes {
  public id!: number;
  public baseUserId!: number;
  public passwordHash!: string;
  public role!: 'hr' | 'admin';
  public lastLoginAt?: Date | null;
  public createdAt!: Date;
  public updatedAt!: Date;
  public permissions!: number;

  // אופציונלי - תוסיף כאן כל מתודת עזר שתצטרך בעתיד
}

// הגדרת המודל עם השדות והתכונות
AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    baseUserId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('hr', 'admin'),
      allowNull: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    tableName: 'AdminUsers',
    timestamps: false, // כי הטבלה כבר כוללת createdAt ו-updatedAt בעצמה
  }
);

export default AdminUser;