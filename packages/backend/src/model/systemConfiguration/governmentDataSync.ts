import Joi from 'joi';

export class GovernmentDataSyncModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    syncDate: Joi.date().required(),
    recordsProcessed: Joi.number().integer().min(0).required(),
    recordsAdded: Joi.number().integer().min(0).required(),
    recordsUpdated: Joi.number().integer().min(0).required(),
    errors: Joi.array().items(Joi.string()).required(),
    status: Joi.string().valid('completed', 'failed', 'partial').required(),
    triggeredBy: Joi.string().required(), // admin user ID
    fileSource: Joi.string().optional(), // path to downloaded file
  });

  constructor(
    public id: string,
    public syncDate: Date,
    public recordsProcessed: number,
    public recordsAdded: number,
    public recordsUpdated: number,
    public errors: string[],
    public status: 'completed' | 'failed' | 'partial',
    public triggeredBy: string,
    public fileSource?: string
  ) {}

  static create(data: any): Promise<GovernmentDataSyncModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new GovernmentDataSyncModel(
      value.id,
      new Date(value.syncDate),
      value.recordsProcessed,
      value.recordsAdded,
      value.recordsUpdated,
      value.errors,
      value.status,
      value.triggeredBy,
      value.fileSource
    ));
  }
}

// Example usage of the NotificationLogModel

const governmentDataSyncData = {
  id: "sync123",
  syncDate: new Date(),
  recordsProcessed: 100,
  recordsAdded: 80,
  recordsUpdated: 20,
  errors: [],
  status: "completed",
  triggeredBy: "adminUser",
  fileSource: "/path/to/downloaded/file"
};

GovernmentDataSyncModel.create(governmentDataSyncData)
  .then(governmentDataSync => {
    console.log("Government Data Sync created successfully:", governmentDataSync);
  })
  .catch(error => {
    console.error("Error creating government data sync:", error);
  });
