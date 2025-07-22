import Joi from 'joi';

export class UnknownVehicleModel {
  static schema = Joi.object({
    id: Joi.number().integer().positive().allow(null).optional(),
    make: Joi.string().required(),
    model: Joi.string().required(),
    requestCount: Joi.number().integer().min(0).required(),
    lastRequested: Joi.date().required(),
    status: Joi.string().valid('pending_review', 'resolved', 'ignored').required(),
    createdAt: Joi.date().required(),
    resolvedBy: Joi.string().optional(),
    resolvedAt: Joi.date().optional(),
    resolvedVehicleModelId: Joi.number().optional(),
  });

  constructor(
    
    public make: string,
    public model: string,
    public requestCount: number,
    public lastRequested: Date,
    public status: 'pending_review' | 'resolved' | 'ignored',
    public createdAt: Date,
    public resolvedBy?: string,
    public resolvedAt?: Date,
    public resolvedVehicleModelId?: number,
    public id?: number
  ) {}

  static create(data: any): Promise<UnknownVehicleModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new UnknownVehicleModel(
      
      value.make,
      value.model,
      value.requestCount,
      new Date(value.lastRequested),
      value.status,
      new Date(value.createdAt),
      value.resolvedBy,
      value.resolvedAt ? new Date(value.resolvedAt) : undefined,
      value.resolvedVehicleModelId,
      value.id
    ));
  }
}

// Example usage of the NotificationLogModel



const unknownVehicleModelData = {
  make: 'Toyota',
  model: 'Corolla',
  requestCount: 5,
  lastRequested: '2023-10-01T12:00:00Z',
  status: 'pending_review',
  createdAt: '2023-10-01T12:00:00Z',
  resolvedBy: null,
  resolvedAt: null,
  resolvedVehicleModelId: null,
  id: 123
};

UnknownVehicleModel.create(unknownVehicleModelData)
  .then(unknownVehicleModel => {
    console.log("Unknown Vehicle Model created successfully:", unknownVehicleModel);
  })
  .catch(error => {
    console.error("Error creating unknown vehicle model:", error);
  });
