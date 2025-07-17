import Joi from 'joi';

// יצירת מחלקת ParkingSpot
export class ParkingSpot {
  static schema = Joi.object({
    id: Joi.string().required(),
    type: Joi.string().valid('surface', 'underground').required(),
    spotNumber: Joi.string().required(),
    isOccupied: Joi.boolean().required(),
    currentVehicleId: Joi.string().optional(),
    lastUpdated: Joi.date().required(),
  });

  constructor(
    public id: string,
    public type: 'surface' | 'underground',
    public spotNumber: string,
    public isOccupied: boolean,
    public currentVehicleId?: string,
    public lastUpdated: Date = new Date()
  ) {}

  // פונקציה ליצירת אובייקט ParkingSpot
  static create(data: any): ParkingSpot {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new ParkingSpot(
      value.id,
      value.type,
      value.spotNumber,
      value.isOccupied,
      value.currentVehicleId,
      value.lastUpdated
    );
  }
}

const newParkingSpot = ParkingSpot.create({
  id: 'spot001',
  type: 'surface',
  spotNumber: 'A1',
  isOccupied: false,
  lastUpdated: new Date(),
});

console.log(newParkingSpot);