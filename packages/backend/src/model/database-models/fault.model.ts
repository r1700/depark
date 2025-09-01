import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/sequelize";

export class Fault extends Model {
  public id!: number;
  public parkingId!: number; 
  public faultDescription?: string | null;
  public status!: string;
  public severity!: string; 
  public resolvedAt?: Date | null; 
  public assigneeId?: number | null;
  public createdAt!: Date;
  public updatedAt!: Date;
}

Fault.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    parkingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "parking_id",
    },
    faultDescription: {
      type: DataTypes.TEXT,
      allowNull: true,
      field: "fault_description",
    },
    status: {
      type: DataTypes.ENUM("open", "in_progress", "resolved"),
      allowNull: false,
      defaultValue: "open",
    },
    severity: {
      type: DataTypes.ENUM("low", "medium", "high"),
      allowNull: false,
      defaultValue: "medium",
    },
    resolvedAt: {
      type: DataTypes.DATE,
      allowNull: true,
      field: "resolved_at",
    },
    assigneeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      field: "assignee_id", // FK to technicians
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "created_at",
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      field: "updated_at",
    },
  },
  {
    sequelize,
    modelName: "Fault",
    tableName: "faults",
    timestamps: true,
  }
);
