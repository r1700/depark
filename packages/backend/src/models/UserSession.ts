import { Model, DataTypes, Optional } from 'sequelize';
import sequelize from '../config/sequelize';


export interface UserSessionAttributes {
  id: number;
  user_type: number;
  token: string;
  refresh_token?: string;
  expires_at: Date;
  is_active: boolean;
  ip_address: string;
  user_agent: string;
  created_at: Date;
  last_activity: Date;
}

export interface UserSessionCreationAttributes extends Optional<UserSessionAttributes, 'id' | 'refresh_token'> {}

export class UserSession extends Model<UserSessionAttributes, UserSessionCreationAttributes>
  implements UserSessionAttributes {
  public id!: number;
  public user_type!: number;
  public token!: string;
  public refresh_token?: string;
  public expires_at!: Date;
  public is_active!: boolean;
  public ip_address!: string;
  public user_agent!: string;
  public created_at!: Date;
  public last_activity!: Date;
}

UserSession.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    user_type: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refresh_token: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ip_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    user_agent: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    last_activity: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'usersessions',
    timestamps: false,
    underscored: true,
  }
);

export default UserSession;