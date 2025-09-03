import { Model, DataTypes} from 'sequelize';
import sequelize from '../../config/sequelize'; 
if (!sequelize) {
  throw new Error('Sequelize instance is not properly imported!');
}

console.log('🔍 Using sequelize instance:', sequelize.constructor.name);

// BaseUser Model
export class BaseUser extends Model {
  public id!: number;
  public email!: string;
  public first_name!: string;
  public last_name!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public adminData?: AdminUser;
}

BaseUser.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: false },
  first_name: { type: DataTypes.STRING, allowNull: false },
  last_name: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false },
  updated_at: { type: DataTypes.DATE, allowNull: false },
}, {
  sequelize,
  modelName: 'BaseUser',
  tableName: 'baseuser',
  timestamps: false,
});

// AdminUser Model
export class AdminUser extends Model {
  public id!: number;
  public baseuser_id!: number;
  public password_hash!: string;
  public role!: number;
  public permissions!: string[];
  public last_login_at?: Date;
}

AdminUser.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  baseuser_id: { type: DataTypes.INTEGER, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  role: { type: DataTypes.INTEGER, allowNull: false },
  permissions: { type: DataTypes.JSONB, allowNull: false, defaultValue: [] },
  last_login_at: { type: DataTypes.DATE, allowNull: true },
}, {
  sequelize,
  modelName: 'AdminUser',
  tableName: 'adminusers',
  timestamps: false,
});

// UserSession Model
export class UserSession extends Model {
  public id!: number;
  public baseuser_id!: number;
  public user_type!: string;
  public token!: string;
  public refresh_token?: string;
  public expires_at!: Date;
  public is_active!: boolean;
  public ip_address!: string;
  public user_agent!: string;
  public created_at!: Date;
  public last_activity!: Date;
  public temp_token?: string;
}

UserSession.init({
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  baseuser_id: { type: DataTypes.INTEGER, allowNull: false },
  user_type: { type: DataTypes.STRING, allowNull: false },
  token: { type: DataTypes.STRING, allowNull: false },
  refresh_token: { type: DataTypes.STRING, allowNull: true },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  is_active: { type: DataTypes.BOOLEAN, allowNull: false },
  ip_address: { type: DataTypes.STRING, allowNull: false },
  user_agent: { type: DataTypes.STRING, allowNull: false },
  created_at: { type: DataTypes.DATE, allowNull: false },
  last_activity: { type: DataTypes.DATE, allowNull: false },
  temp_token: { type: DataTypes.STRING, allowNull: true },
}, {
  sequelize,
  modelName: 'UserSession',
  tableName: 'usersessions',
  timestamps: false,
});

// יחסים
BaseUser.hasOne(AdminUser, { foreignKey: 'baseuser_id', as: 'adminData' });
AdminUser.belongsTo(BaseUser, { foreignKey: 'baseuser_id', as: 'baseData' });

console.log('✅ Models initialized successfully');

export { sequelize };