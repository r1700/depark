import { DataTypes, Model, Op } from 'sequelize';
import sequelize from '../../config/sequelize';

// Vehicle
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

// ParkingSession
export class ParkingSession extends Model {
    public id!: string;
    public baseuser_id!: string;
    public vehicle_id!: string;
    public parking_spots_id!: string;
    public license_plate!: string;
    public surface_spot!: string;
    public underground_spot!: string;
    public status!: number;  //1=parked, 2=retrieval_requested, 3=completed
    public entry_time!: Date;
    public exit_time!: Date;
    public retrieval_request_time!: Date;
    public actual_retrieval_time!: Date;
    public pickup_spot!: string;
    public requested_by!: number;//1=mobile, 2=tablet
}
ParkingSession.init({
    id: { type: DataTypes.UUID, primaryKey: true },
    baseuser_id: { type: DataTypes.STRING, field: 'baseuser_id' },
    vehicle_id: { type: DataTypes.STRING, field: 'vehicle_id' },
    parking_spots_id: { type: DataTypes.STRING, field: 'parking_spots_id' },
    license_plate: { type: DataTypes.STRING, field: 'license_plate' },
    surface_spot: { type: DataTypes.STRING, field: 'surface_spot' },
    underground_spot: { type: DataTypes.STRING, field: 'underground_spot' },
    status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 1,//1=parked, 2=retrieval_requested, 3=completed
        validate: {
            isIn: [[1, 2, 3]],
        },
    },
    entry_time: { type: DataTypes.DATE, field: 'entry_time' },
    exit_time: { type: DataTypes.DATE, field: 'exit_time' },
    retrieval_request_time: { type: DataTypes.DATE, field: 'retrieval_request_time' },
    actual_retrieval_time: { type: DataTypes.DATE, field: 'actual_retrieval_time' },
    pickup_spot: { type: DataTypes.STRING, field: 'pickup_spot' },
    requested_by: {
        type: DataTypes.INTEGER,
        field: 'requested_by',
        validate: {
            isIn: [[1, 2]],
        },
    },
}, { sequelize, tableName: 'parkingsessions', timestamps: false });

// RetrievalQueue
export class RetrievalQueue extends Model {
    public id!: string;
    public baseuser_id!: string;
    public parking_session_id!: string;
    public license_plate!: string;
    public underground_spot!: string;
    public requested_at!: Date;
    public estimated_time!: Date;
    public position!: number;
    public status!: number;
    public assigned_pickup_spot!: string;
    public request_source!: number;
}
RetrievalQueue.init({
    id: { type: DataTypes.UUID, primaryKey: true },
    parking_session_id: { type: DataTypes.STRING, field: 'parking_session_id' },
    baseuser_id: { type: DataTypes.STRING, field: 'baseuser_id' },
    license_plate: { type: DataTypes.STRING, field: 'license_plate' },
    underground_spot: { type: DataTypes.STRING, field: 'underground_spot' },
    requested_at: { type: DataTypes.DATE, field: 'requested_at' },
    estimated_time: { type: DataTypes.DATE, allowNull: true, field: 'estimated_time' },
    position: DataTypes.INTEGER,
    status: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1=queued, 2=processing, 3=ready, 4=completed
      validate: {
        isIn: [[1, 2, 3, 4]],
        // isIn: [['queued', 'processing', 'ready', 'completed']],
      },
    },
    assigned_pickup_spot: { type: DataTypes.STRING, field: 'assigned_pickup_spot' },
    request_source: {
        type: DataTypes.INTEGER,
        field: 'request_source',
        validate: {
            isIn: [[1, 2]],
        },
    },
}, {
    sequelize,
    tableName: 'retrievalqueues',
    timestamps: false,
    indexes: [{
        unique: true,
        name: 'unique_active_vehicle',
        fields: ['license_plate'],
        where: { status: { [Op.ne]: 4 } }
    }]
});
