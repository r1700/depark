import Joi from 'joi';

export interface NotificationLog {
  id: string;
  userId?: string;
  type: 'queue_update' | 'retrieval_ready' | 'parking_full' | 'system_maintenance';
  channel: 'websocket' | 'push_notification';
  message: string;
  delivered: boolean;
  deliveredAt?: Date;
  error?: string;
  timestamp: Date;
}

export const NotificationLogSchema = Joi.object({
  id: Joi.string().required(),
  userId: Joi.string().optional(),
  type: Joi.string().valid('queue_update', 'retrieval_ready', 'parking_full', 'system_maintenance').required(),
  channel: Joi.string().valid('websocket', 'push_notification').required(),
  message: Joi.string().required(),
  delivered: Joi.boolean().required(),
  deliveredAt: Joi.date().optional(),
  error: Joi.string().optional(),
  timestamp: Joi.date().required(),
});

// דוגמת שימוש עם הוולידציה

const notificationLogData = {
  id: "log123",
  userId: "user456",
  type: "queue_update",
  channel: "push_notification",
  message: "Your queue has been updated.",
  delivered: true,
  deliveredAt: new Date(),
  error: null,
  timestamp: new Date(),
};

const { error, value } = NotificationLogSchema.validate(notificationLogData);

if (error) {
  console.error("שגיאה בוולידציה:", error);
} else {
  console.log("הנתונים תקינים:", value);
}
