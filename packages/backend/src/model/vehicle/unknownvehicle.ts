import Joi from 'joi';

export class UnknownVehicleModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    requestCount: Joi.number().integer().min(0).required(),
    lastRequested: Joi.date().required(),
    status: Joi.string().valid('pending_review', 'resolved', 'ignored').required(),
    createdAt: Joi.date().required(),
    resolvedBy: Joi.string().optional(),
    resolvedAt: Joi.date().optional(),
    resolvedVehicleModelId: Joi.string().optional(),
  });

  constructor(
    public id: string,
    public make: string,
    public model: string,
    public requestCount: number,
    public lastRequested: Date,
    public status: 'pending_review' | 'resolved' | 'ignored',
    public createdAt: Date,
    public resolvedBy?: string,
    public resolvedAt?: Date,
    public resolvedVehicleModelId?: string
  ) {}

  static create(data: any): Promise<UnknownVehicleModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new UnknownVehicleModel(
      value.id,
      value.make,
      value.model,
      value.requestCount,
      new Date(value.lastRequested),
      value.status,
      new Date(value.createdAt),
      value.resolvedBy,
      value.resolvedAt ? new Date(value.resolvedAt) : undefined,
      value.resolvedVehicleModelId
    ));
  }
}

// דוגמה לשימוש במודל UnknownVehicleModel

const unknownVehicleModelData = {
  id: "unknownModel123",
  make: "UnknownMake",
  model: "UnknownModel",
  requestCount: 5,
  lastRequested: new Date(),
  status: "pending_review",
  createdAt: new Date()
};

UnknownVehicleModel.create(unknownVehicleModelData)
  .then(unknownVehicleModel => {
    console.log("Unknown Vehicle Model created successfully:", unknownVehicleModel);
  })
  .catch(error => {
    console.error("Error creating unknown vehicle model:", error);
  });
