import { DataTypes, Model } from "sequelize";

import sequelize from '../../config/sequelize'



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