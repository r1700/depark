import Joi from 'joi';

export class ParkingConfigurationModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    facilityName: Joi.string().required(),
    totalSurfaceSpots: Joi.number().integer().min(1).required(), // At least 1 spot
    surfaceSpotIds: Joi.array().items(Joi.string()).min(1).max(6).required(), // IDs of spots
    avgRetrievalTimeMinutes: Joi.number().integer().min(0).default(1).required(), // Minimum 0 minutes
    maxQueueSize: Joi.number().integer().min(1).required(), // At least 1
    operatingHours: Joi.object({
      start: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required(), // Time format "HH:mm"
      end: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d)$/).required() // Time format "HH:mm"
    }).required(),
    timezone: Joi.string().required(),
    updatedAt: Joi.date().required(),
    updatedBy: Joi.string().required(),
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

const parkingConfigurationData = {
  id: "config123",
  facilityName: "Main Parking",
  totalSurfaceSpots: 10,
  surfaceSpotIds: ["spot1", "spot2"],
  avgRetrievalTimeMinutes: 5,
  maxQueueSize: 20,
  operatingHours: {
    start: "08:00",
    end: "20:00"
  },
  timezone: "Asia/Jerusalem",
  updatedAt: new Date(),
  updatedBy: "admin"
};

ParkingConfigurationModel.create(parkingConfigurationData)
  .then(parkingConfiguration => {
    console.log("Parking Configuration created successfully:", parkingConfiguration);
  })
  .catch(error => {
    console.error("Error creating parking configuration:", error);
  });
