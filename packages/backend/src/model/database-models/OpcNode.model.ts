import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../../config/sequelize'

export interface OpcNodeAttributes {
  id: number;
  nodeName: string;
  nodeId: string;
  description?: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

export type OpcNodeCreationAttributes = Optional<
  OpcNodeAttributes,
  'id' | 'description' | 'createdAt' | 'updatedAt'
>;

export class OpcNode extends Model<OpcNodeAttributes, OpcNodeCreationAttributes>
  implements OpcNodeAttributes {
  public id!: number;
  public nodeName!: string;
  public nodeId!: string;
  public description!: string | null;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

OpcNode.init(
  {
    id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
    nodeName: { field: 'node_name', type: DataTypes.STRING(255), allowNull: false },
    nodeId: { field: 'node_id', type: DataTypes.STRING(512), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true }
  },
  {
    sequelize,
    tableName: 'opc_nodes',
    modelName: 'OpcNode',
    underscored: true,
    timestamps: true   // ✅ זה דואג ל־created_at ו־updated_at
  }
);

OpcNode.addHook('beforeValidate', (instance:any) => {
  instance.nodeName = instance.nodeName?.trim();
  instance.nodeId = instance.nodeId?.trim();
});