import Joi from 'joi';

// יצירת מחלקת BridgeRequest
export class BridgeRequest {
  static schema = Joi.object({
    id: Joi.string().required(),
    type: Joi.valid('vehicle_lookup', 'store_location', 'retrieval_request', 'queue_status').required(),
    payload: Joi.object().required(), // יאפשר כל מבנה נתונים
    status: Joi.valid('pending', 'sent', 'acknowledged', 'failed').required(),
    sentAt: Joi.date().required(),
    acknowledgedAt: Joi.date().optional(),
    response: Joi.object().optional(),
    retryCount: Joi.number().required(),
    maxRetries: Joi.number().required(),
    error: Joi.string().optional(),
  });

  constructor(
    public id: string,
    public type: 'vehicle_lookup' | 'store_location' | 'retrieval_request' | 'queue_status',
    public payload: Record<string, any>,
    public status: 'pending' | 'sent' | 'acknowledged' | 'failed',
    public sentAt: Date,
    public acknowledgedAt?: Date,
    public response?: Record<string, any>,
    public retryCount: number = 0,
    public maxRetries: number = 3,
    public error?: string
  ) {}

  // פונקציה ליצירת BridgeRequest
  static create(data: any): BridgeRequest {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new BridgeRequest(
      value.id,
      value.type,
      value.payload,
      value.status,
      value.sentAt,
      value.acknowledgedAt,
      value.response,
      value.retryCount,
      value.maxRetries,
      value.error
    );
  }
}

// דוגמת יצירה של BridgeRequest
const newBridgeRequest = BridgeRequest.create({
  id: 'request001',
  type: 'vehicle_lookup',
  payload: { vehicleId: 'vehicle123' },
  status: 'pending',
  sentAt: new Date(),
  retryCount: 0,
  maxRetries: 3,
});

console.log(newBridgeRequest);  // הצגת אובייקט BridgeRequest שנוצר