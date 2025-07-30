import Joi from 'joi';

// Creating a VehicleReport class
export class VehicleReport {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    totalVehicles: Joi.number().required(),
    activeVehicles: Joi.number().required(),
    unknownModels: Joi.number().required(),
    dimensionSources: Joi.object({
      manual: Joi.number().required(),
      government_db: Joi.number().required(),
      model_default: Joi.number().required(),
    }).required(),
    topMakes: Joi.array().items(
      Joi.object({
        make: Joi.string().required(),
        count: Joi.number().required(),
      })
    ).required(),
    generatedBy: Joi.string().required(), // user ID
    generatedAt: Joi.date().required(),
  });

  constructor(
    public totalVehicles: number,
    public activeVehicles: number,
    public unknownModels: number,
    public dimensionSources: {
      manual: number;
      government_db: number;
      model_default: number;
    },
    public topMakes: { make: string; count: number }[],
    public generatedBy: string,
    public generatedAt: Date = new Date(),
    public id?: number // identty
  ) {}

  //Function to create VehicleReport
  static create(data: any): VehicleReport {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new VehicleReport(
      value.totalVehicles,
      value.activeVehicles,
      value.unknownModels,
      value.dimensionSources,
      value.topMakes,
      value.generatedBy,
      value.generatedAt,
      value.id
    );
  }
}

// Example of creating a VehicleReport
const newVehicleReport = VehicleReport.create({  
  totalVehicles: 1200,
  activeVehicles: 900,
  unknownModels: 100,
  dimensionSources: {
    manual: 500,
    government_db: 300,
    model_default: 400,
  },
  topMakes: [
    { make: 'Toyota', count: 250 },
    { make: 'Honda', count: 200 },
  ],
  generatedBy: 'user123',
  generatedAt: new Date(),
});

console.log(newVehicleReport);  // Displaying the created VehicleReport object