import { DataTypes, Model, Op } from 'sequelize';

import sequelize from '../../config/sequelize';


// Vehicle
export class Vehicle extends Model {
    public id!: number;
    public userId!: string;
    public licensePlate!: string;
    public vehicleModelId!: string;
    public color!: string;
    public isActive!: boolean;
    public isCurrentlyParked!: boolean;
    public addedBy!: 'user' | 'hr';
    public dimensionOverrides!: any;
    public dimensionsSource!: 'model_reference' | 'manual_override' | 'government_db';
    public createdAt!: Date;
    public updatedAt!: Date;
}
Vehicle.init({
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: DataTypes.STRING,
    licensePlate: DataTypes.STRING,
    vehicleModelId: DataTypes.STRING,
    color: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN,
    isCurrentlyParked: DataTypes.BOOLEAN,
    addedBy: DataTypes.ENUM('user', 'hr'),
    dimensionOverrides: DataTypes.JSONB,
    dimensionsSource: DataTypes.ENUM('model_reference', 'manual_override', 'government_db'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, { sequelize, tableName: 'Vehicles' });

// ParkingSession
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
    id: { type: DataTypes.UUID, primaryKey: true },
    userId: DataTypes.STRING,
    vehicleId: DataTypes.STRING,
    licensePlate: DataTypes.STRING,
    surfaceSpot: DataTypes.STRING,
    undergroundSpot: DataTypes.STRING,
    status: DataTypes.ENUM('parked', 'retrieval_requested', 'completed'),
    entryTime: DataTypes.DATE,
    exitTime: DataTypes.DATE,
    retrievalRequestTime: DataTypes.DATE,
    actualRetrievalTime: DataTypes.DATE,
    pickupSpot: DataTypes.STRING,
    requestedBy: DataTypes.ENUM('mobile', 'tablet'),
}, {
    sequelize,
    tableName: 'ParkingSessions',
    timestamps: false 
});

// RetrievalQueue
export class RetrievalQueue extends Model {
    public id!: number;
    public sessionId!: string;
    public userId!: string;
    public licensePlate!: string;
    public undergroundSpot!: string;
    public requestedAt!: Date;
    public estimatedTime!: Date;
    public position!: number;
    public status!: 'queued' | 'processing' | 'ready' | 'completed';
    public assignedPickupSpot!: string;
    public requestSource!: 'mobile' | 'tablet';
    public createdAt!: Date;
    public updatedAt!: Date;
}
RetrievalQueue.init({
    id: { type: DataTypes.UUID, primaryKey: true },
    sessionId: DataTypes.STRING,
    userId: DataTypes.STRING,
    licensePlate: DataTypes.STRING,
    undergroundSpot: DataTypes.STRING,
    requestedAt: DataTypes.DATE,
    estimatedTime: { type: DataTypes.DATE, allowNull: true }, // opc זמן משוער להשלמת הבקשה
    position: DataTypes.INTEGER,
    status: DataTypes.ENUM('queued', 'processing', 'ready', 'completed'),
    assignedPickupSpot: DataTypes.STRING,
    requestSource: DataTypes.ENUM('mobile', 'tablet'),
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
}, {
    sequelize,
    tableName: 'RetrievalQueues',
    indexes: [{
        unique: true,
        name: 'unique_active_vehicle',
        fields: ['licensePlate'],
        where: {
            status: {
                [Op.ne]: 'completed'
            }
        }
    }]
});
