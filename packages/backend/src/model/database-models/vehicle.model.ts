import { Sequelize, DataTypes, Model } from "sequelize";
import sequelize from '../../config/sequelize'

export class Vehicle extends Model {
    public id!: string;
    public baseuser_id!: string;
    public license_plate!: string;
    public vehicle_model_id!: string;
    public color!: string;
    public is_active!: boolean;
    public is_currently_parked!: boolean;
    public added_by!: string;
    public dimension_overrides!: any;
    public dimensions_source!: string;
    public created_at!: Date;
    public updated_at!: Date;
}
Vehicle.init({
    id: { type: DataTypes.UUID, primaryKey: true },
    baseuser_id: { type: DataTypes.STRING, field: 'baseuser_id' },
    license_plate: { type: DataTypes.STRING, field: 'license_plate' },
    vehicle_model_id: { type: DataTypes.STRING, field: 'vehicle_model_id' },
    color: DataTypes.STRING,
    is_active: { type: DataTypes.BOOLEAN, field: 'is_active' },
    is_currently_parked: { type: DataTypes.BOOLEAN, field: 'is_currently_parked' },
    added_by: { type: DataTypes.STRING, field: 'added_by' },
    dimension_overrides: { type: DataTypes.JSONB, field: 'dimension_overrides' },
    dimensions_source: { type: DataTypes.STRING, field: 'dimensions_source' },
    created_at: { type: DataTypes.DATE, field: 'created_at' },
    updated_at: { type: DataTypes.DATE, field: 'updated_at' },
}, { sequelize, tableName: 'vehicles', timestamps: false });
