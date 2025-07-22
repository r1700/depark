import Joi from 'joi';

export class Vehicle {
  static schema = Joi.object({
    id: Joi.number().integer().positive().allow(null).optional(),
    userId: Joi.number().required(),
    licensePlate: Joi.string().required(),
    vehicleModelId: Joi.number().optional(),
    color: Joi.string().optional(),
    isActive: Joi.boolean().required(),
    isCurrentlyParked: Joi.boolean().required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    addedBy: Joi.string().valid('user', 'hr').required(),
    dimensionOverrides: Joi.object({
      height: Joi.number().optional(),
      width: Joi.number().optional(),
      length: Joi.number().optional(),
      weight: Joi.number().optional()
    }).optional(),
    dimensionsSource: Joi.string().valid('model_reference', 'manual_override', 'government_db').required()
  });

  constructor(
    
    public userId: number,
    public licensePlate: string,
    public isActive: boolean,
    public isCurrentlyParked: boolean,
    public createdAt: Date,
    public updatedAt: Date,
    public addedBy: 'user' | 'hr',
    public dimensionsSource: 'model_reference' | 'manual_override' | 'government_db',
    public vehicleModelId?: number,
    public color?: string,
    public dimensionOverrides?: {
      height?: number;
      width?: number;
      length?: number;
      weight?: number;
    },
    public id?: number,
  ) {}

  static create(data: any): Promise<Vehicle> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new Vehicle(
      
      value.userId,
      value.licensePlate,
      value.isActive,
      value.isCurrentlyParked,
      new Date(value.createdAt),
      new Date(value.updatedAt),
      value.addedBy,
      value.dimensionsSource,
      value.vehicleModelId,
      value.color,
      value.dimensionOverrides,
      value.id,
    ));
  }
}


// Example usage of the NotificationLogModel

const vehicleData = {
  id: 1,
  userId: 123,
  licensePlate: "XYZ-1234",
  vehicleModelId: 456,
  color: "Red",
  isActive: true,
  isCurrentlyParked: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  addedBy: "user",
  dimensionOverrides: {
    height: 1.5,
    width: 1.8,
    length: 4.5,
    weight: 1500
  },
  dimensionsSource: "manual_override"
};

Vehicle.create(vehicleData)
  .then(vehicle => {
    console.log("Vehicle created successfully:", vehicle);
  })
  .catch(error => {
    console.error("Error creating vehicle:", error);
  });


