import Joi from 'joi';

export class SystemHealthModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    component: Joi.string().valid('opc_bridge', 'api_server', 'database', 'websocket_server', 'government_sync').required(),
    status: Joi.string().valid('healthy', 'warning', 'error').required(),
    message: Joi.string().optional(),
    metrics: Joi.object().optional(),
    timestamp: Joi.date().required(),
  });

  constructor(
    public id: string,
    public component: 'opc_bridge' | 'api_server' | 'database' | 'websocket_server' | 'government_sync',
    public status: 'healthy' | 'warning' | 'error',
    public timestamp: Date, // פרמטר נדרש קודם
    public message?: string, // פרמטר אופציונלי אחרי הנדרשים
    public metrics?: Record<string, number>
  ) {}

  static create(data: any): Promise<SystemHealthModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new SystemHealthModel(
      value.id,
      value.component,
      value.status,
      new Date(value.timestamp),
      value.message,
      value.metrics
    ));
  }
}

// דוגמת שימוש ב-SystemHealthModel

const systemHealthData = {
  id: "health123",
  component: "api_server",
  status: "healthy",
  message: "All systems operational",
  metrics: { responseTime: 200, uptime: 99.9 },
  timestamp: new Date()
};

SystemHealthModel.create(systemHealthData)
  .then(systemHealth => {
    console.log("System Health created successfully:", systemHealth);
  })
  .catch(error => {
    console.error("Error creating system health:", error);
  });
