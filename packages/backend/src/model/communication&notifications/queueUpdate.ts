import Joi from 'joi';





export class QueueUpdateModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    retrievalQueueId: Joi.string().required(),
    position: Joi.number().required(),
    estimatedTime: Joi.date().required(),
    status: Joi.string().valid('queued', 'processing', 'ready').required(),
    message: Joi.string().optional(),
    timestamp: Joi.date().required(),
    broadcastTo: Joi.string().valid('specific_user', 'all_tablets', 'all_connected').required()
  });

  constructor(
    public id: string,
    public retrievalQueueId: string,
    public position: number,
    public estimatedTime: Date,
    public status: 'queued' | 'processing' | 'ready',
    public timestamp: Date,
    public broadcastTo: 'specific_user' | 'all_tablets' | 'all_connected',
    public message?: string
  ) {}

  static create(data: any): Promise<QueueUpdateModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new QueueUpdateModel(
      value.id,
      value.retrievalQueueId,
      value.position,
      new Date(value.estimatedTime),
      value.status,
      new Date(value.timestamp),
      value.broadcastTo,
      value.message
    ));
  }
}

// Example usage of QueueUpdateModel

const queueUpdateData = {
  id: "update123",
  retrievalQueueId: "queue456",
  position: 1,
  estimatedTime: new Date(),
  status: "queued",
  message: "Your item is being processed.",
  timestamp: new Date(),
  broadcastTo: "specific_user",
};

QueueUpdateModel.create(queueUpdateData)
  .then(queueUpdate => {
    console.log("Queue Update created successfully:", queueUpdate);
  })
  .catch(error => {
    console.error("Error creating queue update:", error);
  });
