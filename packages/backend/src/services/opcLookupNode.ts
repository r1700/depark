import { getNodeIdByName } from './opcNode.service';

export async function resolveNodeId(nodeName: string): Promise<string> {
  const nodeId = await getNodeIdByName(nodeName);
  if (!nodeId) throw new Error(`OPC node not found: ${nodeName}`);
  return nodeId;
}
