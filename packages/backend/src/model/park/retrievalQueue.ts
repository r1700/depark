import Joi from 'joi';

// Creating a RetrievalQueue class
export class RetrievalQueue {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    sessionId: Joi.number().integer().positive().required(),//reference to ParkingSession
    userId:Joi.number().integer().positive().optional().allow(null),//reference to baseuser
    licensePlate: Joi.string().required(),
    undergroundSpot: Joi.string().required(),
    requestedAt: Joi.date().required(),
    estimatedTime: Joi.date().required(),
    position: Joi.number().integer().required(),
    status: Joi.string().valid('queued', 'processing', 'ready', 'completed').required(),
    assignedPickupSpot: Joi.string().optional(),
    requestSource: Joi.string().valid('mobile', 'tablet').required(),
  });

  constructor(
    public sessionId: number,
    public userId?: number,
    public licensePlate: string = '',   
    public undergroundSpot: string  = '',
    public requestedAt: Date    = new Date(),
    public estimatedTime: Date  = new Date(),
    public position: number     = 0,
    public status: 'queued' | 'processing' | 'ready' | 'completed' = 'queued',
    public assignedPickupSpot?: string,
    public requestSource: 'mobile' | 'tablet' = 'mobile',
    public id?: number // identity
  ) {}

  //  Method to create a new RetrievalQueue object
  static create(data: any): RetrievalQueue {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new RetrievalQueue(
      value.sessionId,
      value.userId, 
      value.licensePlate,
      value.undergroundSpot,
      value.requestedAt,
      value.estimatedTime,
      value.position,
      value.status,
      value.assignedPickupSpot,
      value.requestSource,
      value.id
    );
  }
}

