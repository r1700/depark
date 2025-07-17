import Joi from 'joi';

export class ParkingSession {
  static schema = Joi.object({
    id: Joi.string().required(),
    userId: Joi.string().required(),
    vehicleId: Joi.string().required(),
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
    parkingSpotId: Joi.string().required(), // reference to the parking spot ID////////////
  });

  constructor(
    public id: string,
    public userId: string,
    public vehicleId: string,
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
    public parkingSpotId?: string // reference to the parking spot ID
  ) {}

  // Method to create a new ParkingSession object
  static create(data: any): ParkingSession {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new ParkingSession(
      value.id,
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
      value.parkingSpotId
    );
  }
}

// Example of creating a ParkingSession
const newParkingSession = ParkingSession.create({
  id: 'session123',
  userId: 'user123',
  vehicleId: 'vehicle123',
  licensePlate: 'ABC1234',
  status: 'parked',
  entryTime: new Date(),
  parkingSpotId: 'spot123', // Reference to a parking spot ID
});

console.log(newParkingSession);