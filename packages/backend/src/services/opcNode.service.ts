import { Op } from 'sequelize';
import { OpcNode, OpcNodeCreationAttributes } from '../model/database-models/OpcNode.model';

export async function createOpcNode(payload: OpcNodeCreationAttributes) {
  return OpcNode.create(payload);
}

export async function listOpcNodes(query?: { search?: string }) {
  const where: any = {};
  if (query?.search) {
    where[Op.or] = [
      { nodeName: { [Op.iLike]: `%${query.search}%` } },
      { nodeId:   { [Op.iLike]: `%${query.search}%` } },
      { description: { [Op.iLike]: `%${query.search}%` } }
    ];
  }
  return OpcNode.findAll({ where, order: [['nodeName', 'ASC']] });
}

export async function getOpcNodeById(id: number) {
  return OpcNode.findByPk(id);
}

export async function getNodeIdByName(nodeName: string) {
  const row = await OpcNode.findOne({ where: { nodeName } });
  return row?.nodeId ?? null;
}

export async function updateOpcNode(
  id: number,
  payload: Partial<OpcNodeCreationAttributes>
) {
  const row = await OpcNode.findByPk(id);
  if (!row) return null;
  await row.update(payload);
  return row;
}

export async function removeOpcNode(id: number) {
  return OpcNode.destroy({ where: { id } });
}
