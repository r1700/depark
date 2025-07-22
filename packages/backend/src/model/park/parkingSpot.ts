import Joi from 'joi';

// Creating a ParkingSpot class
export class ParkingSpot {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    type: Joi.string().valid('surface', 'underground').required(),
    spotNumber: Joi.string().required(),
    isOccupied: Joi.boolean().required(),
    VehicleId: Joi.number().integer().positive().optional(),//reference to Vehicle
    lastUpdated: Joi.date().required(),
  });

  constructor(
    public type: 'surface' | 'underground',
    public spotNumber: string,
    public isOccupied: boolean,
    public VehicleId?: number,
    public lastUpdated: Date = new Date(),
    public id?: number // identty
  ) {}

  //  Method to create a new ParkingSpot object
  static create(data: any): ParkingSpot {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new ParkingSpot(
      value.type,
      value.spotNumber,
      value.isOccupied,
      value.VehicleId,
      value.lastUpdated,
      value.id
    );
  }
}

