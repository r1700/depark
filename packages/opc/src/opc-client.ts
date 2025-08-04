import express, { Request, Response } from 'express';
import {
  OPCUAClient,
  AttributeIds,
  DataType,
  ClientSession,
  ReadValueIdOptions,
  DataValue
} from 'node-opcua';
const app = express();
app.use(express.json());
const endpointUrl: string = "opc.tcp://localhost:4080/UA/PLC";
// Multiple nodeIds read

let opcClient: OPCUAClient | null = null;
let opcSession: ClientSession | null = null;

// יצירת לקוח יחיד
async function getOpcClient(): Promise<OPCUAClient> {
  if (!opcClient) {
    opcClient = OPCUAClient.create({ endpointMustExist: false });
    await opcClient.connect(endpointUrl);
    console.log("Connected to OPC UA Server");
  }
  return opcClient;
}

// יצירת Session יחיד
export async function getOpcSession(): Promise<ClientSession> {
  if (!opcSession) {
    const client = await getOpcClient();
    opcSession = await client.createSession();
    console.log("Session created");
  }
  return opcSession;
}

// סגירת הלקוח וה-Session (למשל, בעת סיום היישום)
async function closeOpcConnection() {
  if (opcSession) {
    await opcSession.close();
    console.log("Session closed");
    opcSession = null;
  }
  if (opcClient) {
    await opcClient.disconnect();
    console.log("Client disconnected");
    opcClient = null;
  }
}

export async function readNodeValues(
  session: ClientSession,
  nodeIds: string[]
): Promise<{ nodeId: string; value: any }[]> {
  const nodesToRead: ReadValueIdOptions[] = nodeIds.map(nodeId => ({
    nodeId,
    attributeId: AttributeIds.Value
  }));
  const results: DataValue[] = await session.read(nodesToRead);
  return results.map((res, i) => ({
    nodeId: nodeIds[i],
    value: res.value?.value
  }));
}
// Multiple nodeIds write
export interface WriteItem {
  nodeId: string;
  value: boolean;
}
export async function writeNodeValues(
  session: ClientSession,
  writeItems: WriteItem[]
): Promise<void> {
  const nodesToWrite = writeItems.map(item => ({
    nodeId: item.nodeId,
    attributeId: AttributeIds.Value,
    value: {
      value: {
        dataType: DataType.Boolean,
        value: item.value
      }
    }
  }));
  await session.write(nodesToWrite);
}

process.on("SIGINT", async () => {
  console.log("Closing OPC UA connection...");
  await closeOpcConnection();
  process.exit(0);
});

