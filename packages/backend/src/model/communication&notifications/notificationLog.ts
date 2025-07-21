import Joi from 'joi';

export class NotificationLogModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    userId: Joi.string().optional(),
    type: Joi.string().valid('queue_update', 'retrieval_ready', 'parking_full', 'system_maintenance').required(),
    channel: Joi.string().valid('websocket', 'push_notification').required(),
    message: Joi.string().required(),
    delivered: Joi.boolean().required(),
    deliveredAt: Joi.date().optional(),
    error: Joi.string().optional(),
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    timestamp: Joi.date().required(),
=======
    timestamp: Joi.date().required()
>>>>>>> Stashed changes
=======
    timestamp: Joi.date().required()
>>>>>>> Stashed changes
  });

  constructor(
    public id: string,
    public type: 'queue_update' | 'retrieval_ready' | 'parking_full' | 'system_maintenance',
    public channel: 'websocket' | 'push_notification',
    public message: string,
    public delivered: boolean,
    public timestamp: Date,
<<<<<<< Updated upstream
<<<<<<< Updated upstream
    public userId?: string, // Move optional parameter to the end
    public deliveredAt?: Date,
=======
    public deliveredAt?: Date,
    public userId?: string,
>>>>>>> Stashed changes
=======
    public deliveredAt?: Date,
    public userId?: string,
>>>>>>> Stashed changes
    public error?: string
  ) {}

  static create(data: any): Promise<NotificationLogModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new NotificationLogModel(
      value.id,
      value.type,
      value.channel,
      value.message,
      value.delivered,
      new Date(value.timestamp),
<<<<<<< Updated upstream
<<<<<<< Updated upstream
      value.userId,
      value.deliveredAt ? new Date(value.deliveredAt) : undefined,
=======
      value.deliveredAt ? new Date(value.deliveredAt) : undefined,
      value.userId,
>>>>>>> Stashed changes
=======
      value.deliveredAt ? new Date(value.deliveredAt) : undefined,
      value.userId,
>>>>>>> Stashed changes
      value.error
    ));
  }
}

<<<<<<< Updated upstream
<<<<<<< Updated upstream
// Example usage of the NotificationLogModel
=======
// Example usage of NotificationLogModel
>>>>>>> Stashed changes
=======
// Example usage of NotificationLogModel
>>>>>>> Stashed changes

const notificationLogData = {
  id: "log123",
  userId: "user456",
  type: "queue_update",
<<<<<<< Updated upstream
<<<<<<< Updated upstream
  channel: "websocket",
  message: "Your queue has been updated.",
=======
  channel: "push_notification",
  message: "Your parking spot is ready.",
>>>>>>> Stashed changes
=======
  channel: "push_notification",
  message: "Your parking spot is ready.",
>>>>>>> Stashed changes
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
