import { Sequelize, DataTypes, Op, Dialect } from 'sequelize';
import {thisSequelize} from '../../config/sequelize.config';
const env: 'development' | 'test' = process.env.NODE_ENV as 'development' | 'test' || 'test';

const sequelize = thisSequelize;

// models/BaseUser.ts

import { Model } from 'sequelize';


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
        surface_spot_ids: { type: DataTypes.JSONB, allowNull: true }, // PostgreSQL JSONB
        avg_retrieval_time_minutes: { type: DataTypes.INTEGER, allowNull: true },
        max_queue_size: { type: DataTypes.INTEGER, allowNull: true },
        operating_hours: { type: DataTypes.JSONB, allowNull: true }, // שעות פעילות
        timezone: { type: DataTypes.STRING, allowNull: true },
        updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        updated_by: { type: DataTypes.STRING, allowNull: true },
    },
    {
        sequelize,
        tableName: 'facility', // שם הטבלה ב-DB
        timestamps: false,
    }
);

export default { parkingconfigurations, vehicles };

async function addVehicleData(
  baseuser_id: number,
  license_plate: string,
  vehicle_model_id: number | null,
  color: string | null,
  is_active: boolean,
  is_currently_parked: boolean,
  added_by: string | null,
  dimension_overrides: object | null,
  dimensions_source: string | null
) {
  try {
    const newVehicle = await vehicles.create({
      baseuser_id,
      license_plate,
      vehicle_model_id,
      color,
      is_active,
      is_currently_parked,
      created_at: new Date(),  // הזמן הנוכחי
      updated_at: new Date(),  // הזמן הנוכחי
      added_by,
      dimension_overrides,
      dimensions_source,
    });

    return newVehicle;  // מחזיר את האובייקט שנוסף
  } catch (error) {
    console.error('Error while adding vehicle data:', error);
    throw error;
  }
}

 addVehicleData(
  1,               // baseuser_id
  "123ABC",        // license_plate
  null,            // vehicle_model_id
  "Red",           // color
  true,            // is_active
  false,           // is_currently_parked
  "Admin",         // added_by
  {},              // dimension_overrides
  "UserInput"      // dimensions_source
)
  .then((newVehicle) => {
    console.log("Vehicle added successfully:", newVehicle);
  })
  .catch((error) => {
    console.error("Error adding vehicle:", error);
  });

   addVehicleData(
  2,               // baseuser_id
  "127ABC",        // license_plate
  null,            // vehicle_model_id
  "Red",           // color
  false,          // is_active
  false,           // is_currently_parked
  "Admin",         // added_by
  {},              // dimension_overrides
  "UserInput"      // dimensions_source
)
  .then((newVehicle) => {
    console.log("Vehicle added successfully:", newVehicle);
  })
  .catch((error) => {
    console.error("Error adding vehicle:", error);
  });


