import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize';
import { BaseUser } from './baseUser.model';

interface AdminUserAttributes {
  id: number; // המפתח הראשי בטבלת adminusers
  baseuserId: number; // FK ל-BaseUser
  passwordHash: string;
  role: number; // תואם את הטיפוס של 'role' בסכמה
  permissions: string[]; // מערך של מיתרים (כפי שהוגדר בסכמה)
  lastLoginAt?: Date;
}

type AdminUserCreationAttributes = Optional<AdminUserAttributes, 'id' | 'lastLoginAt'>;

export class AdminUser extends Model<AdminUserAttributes, AdminUserCreationAttributes> 
  implements AdminUserAttributes {
  public id!: number;
  public baseuserId!: number;  // שדה FK
  public passwordHash!: string;
  public role!: number;  // שינוי ל- number
  public permissions!: string[];  // שינוי ל- מערך מיתרים
  public lastLoginAt?: Date;

}

AdminUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true, // מאפשר אוטומטית עבור id
    },
    baseuserId: {
      type: DataTypes.INTEGER,
      allowNull: false,  // שדה חובה כמו שהסכמה מורה
      field: 'baseuser_id', // שם העמודה בטבלה
      references: {
        model: BaseUser, // foreign key ל־BaseUser
        key: 'id',
      },
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'password_hash', // שם העמודה בטבלה

    },
    role: {
      type: DataTypes.INTEGER, // שינוי ל- INTEGER
      allowNull: false,
      
    },
    permissions: {
      type: DataTypes.ARRAY(DataTypes.STRING(255)),  // שינוי למערך של מיתרים
      allowNull: false,
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'last_login_at', // שם העמודה בטבלה

    },
  },
  {
    sequelize,
    modelName: 'AdminUser',
    tableName: 'adminusers', // שם טבלה
    freezeTableName: true, // מונע שינוי שם
    timestamps: false, // לא משמשים בשדות createdAt ו־updatedAt
  }
);

// קשר 1-1 עם BaseUser
BaseUser.hasOne(AdminUser, { foreignKey: 'baseuserId' });
AdminUser.belongsTo(BaseUser, { foreignKey: 'baseuserId' });
