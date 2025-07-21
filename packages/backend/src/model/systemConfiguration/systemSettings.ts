import Joi from 'joi';

export class SystemSettingsModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    key: Joi.string().required(),
    value: Joi.alternatives().try(Joi.string(), Joi.number(), Joi.boolean()).required(),
    description: Joi.string().required(),
    category: Joi.string().valid('parking', 'auth', 'notifications', 'integration', 'government_db').required(),
    updatedAt: Joi.date().required(),
    updatedBy: Joi.string().required(),
  });

  constructor(
    public id: string,
    public key: string,
    public value: string | number | boolean,
    public description: string,
    public category: 'parking' | 'auth' | 'notifications' | 'integration' | 'government_db',
    public updatedAt: Date,
    public updatedBy: string
  ) {}

  static create(data: any): Promise<SystemSettingsModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new SystemSettingsModel(
      value.id,
      value.key,
      value.value,
      value.description,
      value.category,
      new Date(value.updatedAt),
      value.updatedBy
    ));
  }
}


// Example usage of the NotificationLogModel

const systemSettingsData = {
  id: "setting123",
  key: "maxParkingDuration",
  value: 120,
  description: "Maximum parking duration in minutes",
  category: "parking",
  updatedAt: new Date(),
  updatedBy: "adminUser"
};

SystemSettingsModel.create(systemSettingsData)
  .then(systemSettings => {
    console.log("System Settings created successfully:", systemSettings);
  })
  .catch(error => {
    console.error("Error creating system settings:", error);
  });
