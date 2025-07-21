import Joi from 'joi';

export class ParkingConfigurationModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    facilityName: Joi.string().required(),
    totalSurfaceSpots: Joi.number().integer().min(1).required(),
    surfaceSpotIds: Joi.array().items(Joi.string()).required(),
    avgRetrievalTimeMinutes: Joi.number().integer().min(0).default(1).optional(),
    maxQueueSize: Joi.number().integer().min(1).required(),
    operatingHours: Joi.object({
      start: Joi.string().pattern(/^\d{2}:\d{2}$/).required(), // "07:00"
      end: Joi.string().pattern(/^\d{2}:\d{2}$/).required() // "19:00"
    }).required(),
    timezone: Joi.string().required(),
    updatedAt: Joi.date().required(),
    updatedBy: Joi.string().required()
  });

  constructor(
    public id: string,
    public facilityName: string,
    public totalSurfaceSpots: number,
    public surfaceSpotIds: string[],
    public avgRetrievalTimeMinutes: number,
    public maxQueueSize: number,
    public operatingHours: { start: string; end: string },
    public timezone: string,
    public updatedAt: Date,
    public updatedBy: string
  ) {}

  static create(data: any): Promise<ParkingConfigurationModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new ParkingConfigurationModel(
      value.id,
      value.facilityName,
      value.totalSurfaceSpots,
      value.surfaceSpotIds,
      value.avgRetrievalTimeMinutes,
      value.maxQueueSize,
      value.operatingHours,
      value.timezone,
      new Date(value.updatedAt),
      value.updatedBy
    ));
  }
}

// Example usage of ParkingConfigurationModel

const parkingConfigData = {
  id: "parking1",
  facilityName: "Main Street Parking",
  totalSurfaceSpots: 100,
  surfaceSpotIds: ["1", "2", "3", "4", "5", "6"],
  avgRetrievalTimeMinutes: 1,
  maxQueueSize: 50,
  operatingHours: {
    start: "08:00",
    end: "20:00"
  },
  timezone: "Asia/Jerusalem",
  updatedAt: new Date(),
  updatedBy: "adminUser"
};

ParkingConfigurationModel.create(parkingConfigData)
  .then(parkingConfig => {
    console.log("Parking Configuration created successfully:", parkingConfig);
  })
  .catch(error => {
    console.error("Error creating parking configuration:", error);
  });
