import Joi from 'joi';

export interface QueueUpdate {
  id: string;
  retrievalQueueId: string;
  position: number;
  estimatedTime: Date;
  status: 'queued' | 'processing' | 'ready';
  message?: string;
  timestamp: Date;
  broadcastTo: 'specific_user' | 'all_tablets' | 'all_connected';
}

export const QueueUpdateSchema = Joi.object({
  id: Joi.string().required(),
  retrievalQueueId: Joi.string().required(),
  position: Joi.number().integer().required(),
  estimatedTime: Joi.date().required(),
  status: Joi.string().valid('queued', 'processing', 'ready').required(),
  message: Joi.string().optional(),
  timestamp: Joi.date().required(),
  broadcastTo: Joi.string().valid('specific_user', 'all_tablets', 'all_connected').required(),
});

// דוגמת שימוש עם הוולידציה

const queueUpdateData = {
  id: "update123",
  retrievalQueueId: "queue456",
  position: 1,
  estimatedTime: new Date(),
  status: "queued",
  message: "Processing started",
  timestamp: new Date(),
  broadcastTo: "all_connected"
};

const { error, value } = QueueUpdateSchema.validate(queueUpdateData);

if (error) {
  console.error("שגיאה בוולידציה:", error);
} else {
  console.log("הנתונים תקינים:", value);
}
