import Joi from 'joi';

export class ParkingUsageStatsModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    date: Joi.date().required(),
    hour: Joi.number().integer().min(0).max(23).required(),
    totalParkedCars: Joi.number().integer().min(0).required(),
    avgRetrievalTime: Joi.number().min(0).required(),
    maxQueueLength: Joi.number().integer().min(0).required(),
    peakUsageTime: Joi.string().required(),
    utilizationPercentage: Joi.number().min(0).max(100).required(),
    totalEntries: Joi.number().integer().min(0).required(),
    totalExits: Joi.number().integer().min(0).required(),
  });

  constructor(
    public id: string,
    public date: Date,
    public hour: number,
    public totalParkedCars: number,
    public avgRetrievalTime: number,
    public maxQueueLength: number,
    public peakUsageTime: string,
    public utilizationPercentage: number,
    public totalEntries: number,
    public totalExits: number
  ) {}

  static create(data: any): Promise<ParkingUsageStatsModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new ParkingUsageStatsModel(
      value.id,
      new Date(value.date),
      value.hour,
      value.totalParkedCars,
      value.avgRetrievalTime,
      value.maxQueueLength,
      value.peakUsageTime,
      value.utilizationPercentage,
      value.totalEntries,
      value.totalExits
    ));
  }
}

// דוגמה לשימוש במודל ParkingUsageStatsModel

const parkingUsageStatsData = {
  id: "usage123",
  date: new Date(),
  hour: 14,
  totalParkedCars: 150,
  avgRetrievalTime: 5.5,
  maxQueueLength: 10,
  peakUsageTime: "14:00",
  utilizationPercentage: 75,
  totalEntries: 200,
  totalExits: 50
};

ParkingUsageStatsModel.create(parkingUsageStatsData)
  .then(parkingUsageStats => {
    console.log("Parking Usage Stats created successfully:", parkingUsageStats);
  })
  .catch(error => {
    console.error("Error creating parking usage stats:", error);
  });
