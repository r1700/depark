import Joi from 'joi';

// יצירת מחלקת RetrievalQueue
export class RetrievalQueue {
  static schema = Joi.object({
    id: Joi.string().required(),
    sessionId: Joi.string().required(),
    userId: Joi.string().optional().allow(null),
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
    public id: string,
    public sessionId: string,
    public userId?: string,
    public licensePlate: string = '',   
    public undergroundSpot: string  = '',
    public requestedAt: Date    = new Date(),
    public estimatedTime: Date  = new Date(),
    public position: number     = 0,
    public status: 'queued' | 'processing' | 'ready' | 'completed' = 'queued',
    public assignedPickupSpot?: string,
    public requestSource: 'mobile' | 'tablet' = 'mobile'
  ) {}

  // פונקציה ליצירת RetrievalQueue
  static create(data: any): RetrievalQueue {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new RetrievalQueue(
      value.id,
      value.sessionId,
      value.userId, 
      value.licensePlate,
      value.undergroundSpot,
      value.requestedAt,
      value.estimatedTime,
      value.position,
      value.status,
      value.assignedPickupSpot,
      value.requestSource
    );
  }
}

// דוגמת יצירה של RetrievalQueue
const newQueue = RetrievalQueue.create({
  id: 'queue123',
  sessionId: 'session001',
  userId: 'user123',
  licensePlate: 'XYZ1234',
  undergroundSpot: 'spot001',
  requestedAt: new Date(),
  estimatedTime: new Date(),
  position: 1,
  status: 'queued',
  requestSource: 'mobile',
});

console.log(newQueue);  // הצגת אובייקט RetrievalQueue שנוצר