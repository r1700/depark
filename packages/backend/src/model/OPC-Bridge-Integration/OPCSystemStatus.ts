import Joi from 'joi';

// יצירת מחלקת OPCSystemStatus
export class OPCSystemStatus {
  static schema = Joi.object({
    id: Joi.string().required(),
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
    public id: string,
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
    public timestamp: Date
  ) {}

  // פונקציה ליצירת OPCSystemStatus
  static create(data: any): OPCSystemStatus {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new OPCSystemStatus(
      value.id,
      value.isConnected,
      value.lastHeartbeat,
      value.availableSurfaceSpots,
      value.queueLength,
      value.systemErrors,
      value.performanceMetrics,
      value.timestamp
    );
  }
}

// דוגמת יצירה של OPCSystemStatus
const newOPCSystemStatus = OPCSystemStatus.create({
  id: 'system001',
  isConnected: true,
  lastHeartbeat: new Date(),
  availableSurfaceSpots: 25,
  queueLength: 10,
  systemErrors: [],
  performanceMetrics: {
    avgRetrievalTime: 3.5,
    successfulRetrievals: 100,
    failedOperations: 2,
  },
  timestamp: new Date(),
});

console.log(newOPCSystemStatus);  // הצגת אובייקט OPCSystemStatus שנוצר