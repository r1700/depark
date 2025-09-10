
import { Sequelize, DataTypes, Model } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
import sequelize from '../../config/sequelize';
import { UserStatusEnum } from '../../enums/baseuser';


// --- Model baseuser ---
export class baseuser extends Model {
    public id!: string;
    public email!: string;
    public first_name!: string;
    public last_name!: string;
    public created_at!: Date;
    public updated_at!: Date;
     public phone!: string;
    public status?: UserStatusEnum | null;
    public approved_at?: Date | null;
}

baseuser.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,

        },
        email: { type: DataTypes.STRING, allowNull: false },
        first_name: DataTypes.STRING,
        last_name: DataTypes.STRING,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        updated_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        status: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: UserStatusEnum.Pending
        },
        approved_at: {
            type: DataTypes.DATE,
            allowNull: true
        },
        phone: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'baseuser',
        timestamps: false,
    }
);

// --- Model users ---
export class users extends Model {
  public id!: number;
  public baseuser_id!: number;
  public department?: string | null;
  public employee_id?: string | null;
  public google_id?: string | null;
  public max_cars_allowed_parking?: number | null;
  public created_by!: string;
  public approved_by?: string | null;
}

users.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    baseuser_id: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'baseuser', key: 'id' } },
    department: { type: DataTypes.STRING, allowNull: true },
    employee_id: { type: DataTypes.STRING, allowNull: true },
    google_id: { type: DataTypes.STRING, allowNull: true },
    max_cars_allowed_parking: { type: DataTypes.INTEGER, allowNull: true },
    created_by: { type: DataTypes.STRING, allowNull: false },
    approved_by: { type: DataTypes.STRING, allowNull: true },
  },
  {
    sequelize,
    tableName: 'users',
    timestamps: false,
  }
);

// --- Model usersessions ---
export class usersessions extends Model {
    public id!: string;
    public baseuser_id!: string;
    public user_type!: string;
    public token!: string;
    public refresh_token!: string;
    public expires_at!: Date;
    public is_active!: boolean;
    public ip_address!: string;
    public user_agent!: string;
    public created_at!: Date;
    public last_activity!: Date;
    public temp_token!: string;
}

usersessions.init(
    {
        id: {
            type: DataTypes.STRING,
            primaryKey: true,

        },
        baseuser_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        user_type: DataTypes.STRING,
        token: DataTypes.STRING,
        refresh_token: DataTypes.STRING,
        expires_at: DataTypes.DATE,
        is_active: DataTypes.BOOLEAN,
        ip_address: DataTypes.STRING,
        user_agent: DataTypes.STRING,
        created_at: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        },
        last_activity: DataTypes.DATE,
        temp_token: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'usersessions',
        timestamps: false,
    }
);

// קשרים
baseuser.hasMany(usersessions, { foreignKey: 'baseuser_id' });
usersessions.belongsTo(baseuser, { foreignKey: 'baseuser_id' });
users.belongsTo(baseuser, { foreignKey: 'baseuser_id'});

export default sequelize;