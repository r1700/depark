import Joi from 'joi';

// Creating the OPCSystemStatus class
export class OPCSystemStatus {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    isConnected: Joi.boolean().required(),
    lastHeartbeat: Joi.date().required(),
    availableSurfaceSpots: Joi.number().required(),
    queueLength: Joi.number().required(),
    systemErrors: Joi.array().items(Joi.string()).required(),
    performanceMetrics: Joi.object({
      avgRetrievalTime: Joi.number().required(),
      successfulRetrievals: Joi.number().required(),
      failedOperations: Joi.number().required(),
    }).required(),
    timestamp: Joi.date().required(),
  });

  constructor(
    public isConnected: boolean,
    public lastHeartbeat: Date,
    public availableSurfaceSpots: number,
    public queueLength: number,
    public systemErrors: string[],
    public performanceMetrics: {
      avgRetrievalTime: number;
      successfulRetrievals: number;
      failedOperations: number;
    },
    public timestamp: Date,
    public id?: number // identity
  ) {}

  // Function to create OPCSystemStatus
  static create(data: any): OPCSystemStatus {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new OPCSystemStatus(
      value.isConnected,
      value.lastHeartbeat,
      value.availableSurfaceSpots,
      value.queueLength,
      value.systemErrors,
      value.performanceMetrics,
      value.timestamp,
      value.id
    );
  }
}
