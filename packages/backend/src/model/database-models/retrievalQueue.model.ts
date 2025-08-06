import { Sequelize, DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize';

// טיפוסי נתונים לשדות
interface RetrievalQueueAttributes {
  id: string;
  sessionId: string;
  userId?: string | null;
  licensePlate: string;
  undergroundSpot: string;
  requestedAt: Date;
  estimatedTime: Date;
  position: number;
  status: 'queued' | 'processing' | 'ready' | 'completed';
  assignedPickupSpot?: string | null;
  requestSource: 'mobile' | 'tablet';
  createdAt?: Date;
  updatedAt?: Date;
}

// אופציונלי ליצירה (id לא אופציונלי כי primary key)
interface RetrievalQueueCreationAttributes extends Optional<RetrievalQueueAttributes, 'id' | 'userId' | 'assignedPickupSpot' | 'createdAt' | 'updatedAt'> {}

class RetrievalQueue extends Model<RetrievalQueueAttributes, RetrievalQueueCreationAttributes>
  implements RetrievalQueueAttributes {
  public id!: string;
  public sessionId!: string;
  public userId?: string | null;
  public licensePlate!: string;
  public undergroundSpot!: string;
  public requestedAt!: Date;
  public estimatedTime!: Date;
  public position!: number;
  public status!: 'queued' | 'processing' | 'ready' | 'completed';
  public assignedPickupSpot?: string | null;
  public requestSource!: 'mobile' | 'tablet';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

RetrievalQueue.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    licensePlate: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    undergroundSpot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    requestedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    estimatedTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('queued', 'processing', 'ready', 'completed'),
      allowNull: false,
    },
    assignedPickupSpot: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    requestSource: {
      type: DataTypes.ENUM('mobile', 'tablet'),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'RetrievalQueue',
    tableName: 'RetrievalQueues',
    timestamps: true,
  }
);

export default RetrievalQueue;