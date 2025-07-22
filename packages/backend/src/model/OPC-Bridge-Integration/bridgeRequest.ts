import Joi from 'joi';

// Creating a BridgeRequest class
export class BridgeRequest {
  static schema = Joi.object({
    id: Joi.number().integer().positive().optional(),
    type: Joi.valid('vehicle_lookup', 'store_location', 'retrieval_request', 'queue_status').required(),
    payload: Joi.object().required(), // Will allow any data structure
    status: Joi.valid('pending', 'sent', 'acknowledged', 'failed').required(),
    sentAt: Joi.date().required(),
    acknowledgedAt: Joi.date().optional(),
    response: Joi.object().optional(),
    retryCount: Joi.number().required(),
    maxRetries: Joi.number().required(),
    error: Joi.string().optional(),
  });

  constructor(
    public type: 'vehicle_lookup' | 'store_location' | 'retrieval_request' | 'queue_status',
    public payload: Record<string, any>,
    public status: 'pending' | 'sent' | 'acknowledged' | 'failed',
    public sentAt: Date,
    public acknowledgedAt?: Date,
    public response?: Record<string, any>,
    public retryCount: number = 0,
    public maxRetries: number = 3,
    public error?: string,
    public id?: number // identity
  ) {}

  // Function to create BridgeRequest
  static create(data: any): BridgeRequest {
    const { error, value } = this.schema.validate(data);
    if (error) throw error;
    return new BridgeRequest(
      value.type,
      value.payload,
      value.status,
      value.sentAt,
      value.acknowledgedAt,
      value.response,
      value.retryCount,
      value.maxRetries,
      value.error,
      value.id
    );
  }
}

