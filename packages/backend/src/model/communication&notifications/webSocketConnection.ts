import Joi from 'joi';

export class WebSocketConnectionModel {
  static schema = Joi.object({
    id: Joi.string().required(),
    userId: Joi.string().optional(),
    connectionType: Joi.string().valid('mobile', 'tablet').required(),
    isActive: Joi.boolean().required(),
    connectedAt: Joi.date().required(),
    lastActivity: Joi.date().required(),
    ipAddress: Joi.string().ip().required(),
  });

  constructor(
    public id: string,
    public connectionType: 'mobile' | 'tablet', // Required parameter
    public isActive: boolean,
    public connectedAt: Date,
    public lastActivity: Date,
    public ipAddress: string,
    public userId?: string // Optional parameter
  ) {}

  static create(data: any): Promise<WebSocketConnectionModel> {
    const { error, value } = this.schema.validate(data);
    if (error) return Promise.reject(error);

    return Promise.resolve(new WebSocketConnectionModel(
      value.id,
      value.connectionType,
      value.isActive,
      new Date(value.connectedAt),
      new Date(value.lastActivity),
      value.ipAddress,
      value.userId // Here userId can be undefined
    ));
  }
}

// Example usage of WebSocketConnectionModel

const connectionData = {
  id: "conn123",
  userId: null, // null for tablet connections
  connectionType: "tablet",
  isActive: true,
  connectedAt: new Date(),
  lastActivity: new Date(),
  ipAddress: "192.168.1.1"
};

WebSocketConnectionModel.create(connectionData)
  .then(connection => {
    console.log("WebSocket connection created successfully:", connection);
  })
  .catch(error => {
    console.error("Error creating WebSocket connection:", error);
  });
