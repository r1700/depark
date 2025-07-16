import Joi from 'joi';

export class VehicleModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    yearRange: Joi.object({
      start: Joi.number().integer().min(1886).max(new Date().getFullYear()).required(), // מינימום 1886 (שנת הרכב הראשון)
      end: Joi.number().integer().min(Joi.ref('yearRange.start')).max(new Date().getFullYear()).required() // סוף לא יכול להיות לפני התחלה
    }).required(),
    dimensions: Joi.object({
      height: Joi.number().positive().required(),
      width: Joi.number().positive().required(),
      length: Joi.number().positive().required(),
      weight: Joi.number().positive().required()
    }).required(),
    source: Joi.string().valid('manual', 'government_db', 'hr_input').required(),
    createdAt: Joi.date().required(),
    updatedAt: Joi.date().required(),
    updatedBy: Joi.string().optional() // לא חובה
  });

  constructor(
    public id: string,
    public make: string,
    public model: string,
    public yearRange: { start: number; end: number },
    public dimensions: { height: number; width: number; length: number; weight: number },
    public source: 'manual' | 'government_db' | 'hr_input',
    public createdAt: Date,
    public updatedAt: Date,
    public updatedBy?: string
  ) {}

  static create(data: any): Promise<VehicleModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new VehicleModel(
      value.id,
      value.make,
      value.model,
      value.yearRange,
      value.dimensions,
      value.source,
      new Date(value.createdAt),
      new Date(value.updatedAt),
      value.updatedBy
    ));
  }
}

// דוגמה לשימוש במודל VehicleModel

const vehicleModelData = {
  id: "model123",
  make: "Toyota",
  model: "Camry",
  yearRange: {
    start: 2020,
    end: 2022
  },
  dimensions: {
    height: 1.45,
    width: 1.82,
    length: 4.88,
    weight: 1500
  },
  source: "manual",
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: "adminUser"
};

VehicleModel.create(vehicleModelData)
  .then(vehicleModel => {
    console.log("Vehicle Model created successfully:", vehicleModel);
  })
  .catch(error => {
    console.error("Error creating vehicle model:", error);
  });
