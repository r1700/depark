import Joi from 'joi';

export class NotificationLogModel {
  static schema = Joi.object({
    id: Joi.number().integer().positive().allow(null).optional(),
    userId: Joi.number().optional(),
    type: Joi.string().valid('queue_update', 'retrieval_ready', 'parking_full', 'system_maintenance').required(),
    channel: Joi.string().valid('websocket', 'push_notification').required(),
    message: Joi.string().required(),
    delivered: Joi.boolean().required(),
    deliveredAt: Joi.date().optional(),
    error: Joi.string().optional(),
    timestamp: Joi.date().required()
  });

  constructor(
    
    public type: 'queue_update' | 'retrieval_ready' | 'parking_full' | 'system_maintenance',
    public channel: 'websocket' | 'push_notification',
    public message: string,
    public delivered: boolean,
    public timestamp: Date,
    public deliveredAt?: Date,
    public userId?: number,
    public error?: string,
    public id?: number
  ) {}

  static create(data: any): Promise<NotificationLogModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new NotificationLogModel(
     
      value.type,
      value.channel,
      value.message,
      value.delivered,
      new Date(value.timestamp),
      value.deliveredAt ? new Date(value.deliveredAt) : undefined,
      value.userId,
      value.error,
      value.id
    ));
  }
}

// Example usage of NotificationLogModel

const notificationLogData = {
  id: 123,
  userId: 456,
  type: "queue_update",
  channel: "push_notification",
  message: "Your parking spot is ready.",
  delivered: true,
  deliveredAt: new Date(),
  error: null,
  timestamp: new Date()
};

NotificationLogModel.create(notificationLogData)
  .then(notificationLog => {
    console.log("Notification Log created successfully:", notificationLog);
  })
  .catch(error => {
    console.error("Error creating notification log:", error);
  });
