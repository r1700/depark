import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/database';

// ממשק טיפוס המאפיינים של AdminUser
export interface AdminUserAttributes {
  id: number;
  baseuser_id: number;
  password_hash: string;
  role: number;
  permissions: number;
  last_login_at?: Date | null;
}

// בשביל יצירת רשומה חדשה, חלק מהשדות אופציונליים (למשל id)
export interface AdminUserCreationAttributes extends Optional<AdminUserAttributes, 'id' | 'last_login_at'> {}

// מחלקת המודל עצמה עם הטיפוסים שצוינו
export class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes>
  implements AdminUserAttributes {
  public id!: number;
  public baseuser_id!: number;
  public password_hash!: string;
  public role!: number;
  public permissions!: number;
  public last_login_at?: Date | null;
  public created_at!: Date;
  public updated_at!: Date;
}

// הגדרת המודל עם השדות והתכונות
AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    baseuser_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    permissions: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    last_login_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'adminusers', // שם הטבלה ב-DB
    timestamps: false, // כי יש שדות זמן בטבלה
    underscored: true, // שמות שדות ב-snake_case
  }
);

export default AdminUser;