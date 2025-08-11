import Joi from 'joi';

export class ParkingConfigurationModel {
  static schema = Joi.object({
    id: Joi.number().allow(null).optional(),
    facilityName: Joi.string().required(),
    totalSpots: Joi.number().integer().min(1).required(), // Changed to match frontend
    surfaceSpotIds: Joi.array().items(Joi.string()).required(),
    avgRetrievalTimeMinutes: Joi.number().integer().min(0).default(1).optional(),
    maxQueueSize: Joi.number().integer().min(1).required(),
    maxParallelRetrievals: Joi.number().integer().min(1).default(1).optional(), // Added missing field
    operatingHours: Joi.object().required(), // More flexible for daily hours
    timezone: Joi.string().required(),
    maintenanceMode: Joi.boolean().default(false).optional(), // Added missing field
    showAdminAnalytics: Joi.boolean().default(false).optional(), // Added missing field
    updatedAt: Joi.date().required(),
    updatedBy: Joi.string().required()
  });

  constructor(
    public facilityName: string,
    public totalSpots: number, // Changed name
    public surfaceSpotIds: string[],
    public avgRetrievalTimeMinutes: number,
    public maxQueueSize: number,
    public maxParallelRetrievals: number, // Added missing field
    public operatingHours: object, // More flexible
    public timezone: string,
    public maintenanceMode: boolean, // Added missing field
    public showAdminAnalytics: boolean, // Added missing field
    public updatedAt: Date,
    public updatedBy: string,
    public id?: number
  ) {}

  static create(data: any): Promise<ParkingConfigurationModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new ParkingConfigurationModel(
      value.facilityName,
      value.totalSpots,
      value.surfaceSpotIds,
      value.avgRetrievalTimeMinutes,
      value.maxQueueSize,
      value.maxParallelRetrievals || 1,
      value.operatingHours,
      value.timezone,
      value.maintenanceMode || false,
      value.showAdminAnalytics || false,
      new Date(value.updatedAt),
      value.updatedBy,
      value.id
    ));
  }
}

