import Joi from 'joi';

export class ParkingSession {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    userId: Joi.number().integer().positive().required(),//reference to baseuser
    vehicleId: Joi.number().integer().positive().required(),// reference to Vehicle
    licensePlate: Joi.string().required(),
    surfaceSpot: Joi.string().optional(),
    undergroundSpot: Joi.string().optional(),
    status: Joi.valid('parked', 'retrieval_requested', 'completed').required(),
    entryTime: Joi.date().required(),
    exitTime: Joi.date().optional(),
    retrievalRequestTime: Joi.date().optional(),
    actualRetrievalTime: Joi.date().optional(),
    pickupSpot: Joi.string().optional(),
    requestedBy: Joi.valid('mobile', 'tablet').optional(),
    parkingSpotId: Joi.number().integer().positive().required(), //reference to ParkingSpot
  });

  constructor(
    public userId: number,
    public vehicleId: number,
    public licensePlate: string,
    public surfaceSpot?: string,
    public undergroundSpot?: string,
    public status: 'parked' | 'retrieval_requested' | 'completed' = 'parked',
    public entryTime: Date = new Date(),
    public exitTime?: Date,
    public retrievalRequestTime?: Date,
    public actualRetrievalTime?: Date,
    public pickupSpot?: string,
    public requestedBy?: 'mobile' | 'tablet',
    public parkingSpotId?: number ,
    public id?: number // identty
  ) { }

  // Method to create a new ParkingSession object
  static create(data: any): ParkingSession {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new ParkingSession(
      value.userId,
      value.vehicleId,
      value.licensePlate,
      value.surfaceSpot,
      value.undergroundSpot,
      value.status,
      value.entryTime,
      value.exitTime,
      value.retrievalRequestTime,
      value.actualRetrievalTime,
      value.pickupSpot,
      value.requestedBy,
      value.parkingSpotId,
      value.id,
    );
  }
}

