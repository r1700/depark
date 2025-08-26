import { Sequelize, DataTypes, Op, Dialect } from 'sequelize';
import thisSequelize from '../../config/sequelize';
const env: 'development' | 'test' = process.env.NODE_ENV as 'development' | 'test' || 'test';

const sequelize = thisSequelize;

// models/BaseUser.ts

import { Model } from 'sequelize';


export class baseuser extends Model {
    public id!: number;
    public email!: string;
    public first_name!: string;
    public last_name!: string;
    public created_at!: Date;
    public updated_at!: Date;
}
baseuser.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true,autoIncrement: true },
        email: { type: DataTypes.STRING },
        first_name: { type: DataTypes.STRING },
        last_name: { type: DataTypes.STRING },
        created_at: { type: DataTypes.DATE },
        updated_at: { type: DataTypes.DATE },
    },
    {
        sequelize, // Database connection
        modelName: 'baseuser',
        tableName: 'baseuser',
        timestamps: false, // If there are no createdAt and updatedAt columns
    }
)
export default baseuser;
export class User extends Model {
    public id!: number;                  

    // public email!: string;
    public baseuser_id!: number;
    public department!: string;
    public employee_id!: string;         
    public google_id!: string;           
    public status!: number;              
    public max_cars_allowed_parking!: number; 
    public created_by!: string;          
    public approved_by!: string;         
    public approved_at!: Date;                    
    public phone!: string;
}
User.init(
    {
        id: {
            type: DataTypes.INTEGER,      
            primaryKey: true,
            autoIncrement: true,          
        },
        // email: { type: DataTypes.STRING, allowNull: false },
        baseuser_id: { type: DataTypes.INTEGER, allowNull: false },
        department: DataTypes.STRING,
        employee_id: DataTypes.STRING,
        google_id: DataTypes.STRING,
        status: DataTypes.INTEGER,
        max_cars_allowed_parking: DataTypes.INTEGER,
        created_by: DataTypes.STRING,
        approved_by: DataTypes.STRING,
        approved_at: DataTypes.DATE,
        phone: DataTypes.STRING,
    },
    {
        sequelize,
        tableName: 'users',
        timestamps: false,
    }
);
export class ParkingSession extends Model {
    public id!: number;
    public userId!: string;
    public vehicleId!: string;
    public licensePlate!: string;
    public surfaceSpot!: string;
    public undergroundSpot!: string;
    public status!: 'parked' | 'retrieval_requested' | 'completed';
    public entryTime!: Date;
    public exitTime!: Date;
    public retrievalRequestTime!: Date;
    public actualRetrievalTime!: Date;
    public pickupSpot!: string;
    public requestedBy!: 'mobile' | 'tablet';
}
ParkingSession.init({
    id: { 
        type: DataTypes.STRING,          
        primaryKey: true 
    },
    user_id: DataTypes.INTEGER,
    vehicle_id: DataTypes.STRING,
    license_plate: DataTypes.STRING,
    surface_spot: DataTypes.STRING,
    underground_spot: DataTypes.STRING,
    status: DataTypes.ENUM('parked', 'retrieval_requested', 'completed'),
    entry_time: DataTypes.DATE,
    exit_time: DataTypes.DATE,
    retrieval_request_time: DataTypes.DATE,
    actual_retrieval_time: DataTypes.DATE,
    pickup_spot: DataTypes.STRING,
    requested_by: DataTypes.ENUM('mobile', 'tablet'),
}, {
    sequelize,
    tableName: 'parking_sessions',
    timestamps: false
});
export class vehicles extends Model {
    public id!: number;
    public baseuser_id!: number;
    public license_plate!: string;
    public vehicle_model_id!: number | null;
    public color!: string | null;
    public is_active!: boolean;
    public is_currently_parked!: boolean;
    public created_at!: Date;
    public updated_at!: Date;
    public added_by!: string | null;
    public dimension_overrides!: object | null;
    public dimensions_source!: string | null;
}

vehicles.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        baseuser_id: { type: DataTypes.INTEGER, allowNull: false },
        license_plate: { type: DataTypes.STRING, allowNull: false },
        vehicle_model_id: { type: DataTypes.INTEGER, allowNull: true },
        color: { type: DataTypes.STRING, allowNull: true },
        is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
        is_currently_parked: { type: DataTypes.BOOLEAN, defaultValue: false },
        created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        added_by: { type: DataTypes.STRING, allowNull: true },
        dimension_overrides: { type: DataTypes.JSONB, allowNull: true }, // PostgreSQL
        dimensions_source: { type: DataTypes.STRING, allowNull: true },
    },
    {
        sequelize,
        tableName: 'vehicles',
        timestamps: false, // כי created_at / updated_at מנוהלים ידנית
    }
);





export class parkingconfigurations extends Model {
    public id!: number;
    public facility_name!: string;
    public total_surface_spots!: number;
    public surface_spot_ids!: number[] | null; // מניח שמדובר ב-ARRAY או JSON
    public avg_retrieval_time_minutes!: number | null;
    public max_queue_size!: number | null;
    public operating_hours!: object | null; // JSON של שעות פעילות
    public timezone!: string | null;
    public updated_at!: Date;
    public updated_by!: string | null;
}

parkingconfigurations.init(
    {
        id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
        facility_name: { type: DataTypes.STRING, allowNull: false },
        total_surface_spots: { type: DataTypes.INTEGER, allowNull: false },
        surface_spot_ids: { type: DataTypes.ARRAY(DataTypes.INTEGER), allowNull: true }, // PostgreSQL ARRAY
        avg_retrieval_time_minutes: { type: DataTypes.INTEGER, allowNull: true },
        max_queue_size: { type: DataTypes.INTEGER, allowNull: true },
        operating_hours: { type: DataTypes.JSONB, allowNull: true }, // שעות פעילות
        timezone: { type: DataTypes.STRING, allowNull: true },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_by: { type: DataTypes.STRING, allowNull: true },
    },
    {
        sequelize,
        tableName: 'parkingconfigurations', // שם הטבלה ב-DB
        timestamps: false,
    }
);
