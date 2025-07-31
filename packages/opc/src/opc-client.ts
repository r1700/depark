import express from 'express';
import {
  OPCUAClient,
  AttributeIds,
  DataType,
  ClientSession,
  Variant
} from 'node-opcua';
const app = express();
app.use(express.json());
const endpointUrl: string = "opc.tcp://localhost:4080/UA/PLC";

let opcClient: OPCUAClient | null = null;
let opcSession: ClientSession | null = null;

// Function to check if the session is valid
function isChannelValid(session: ClientSession | null): boolean {
  return session ? session.sessionId !== null : false; // If the session exists and has a sessionId, it is valid
}

// Function to check if the client is connected
function isConnected(client: OPCUAClient | null): boolean {
  return client ? client.connectionStrategy.maxRetry === 0 : false; // If the client exists and has valid connection settings
}

// Create a single client
async function getOpcClient(): Promise<OPCUAClient> {
  if (!opcClient || !isConnected(opcClient)) {
    opcClient = OPCUAClient.create({ endpointMustExist: false });
    await opcClient.connect(endpointUrl);
  }
  return opcClient;
}

// Create a single session
export async function ensureSession(): Promise<ClientSession> {
  try {
    if (!opcSession || !isChannelValid(opcSession)) {
      if (opcClient && isConnected(opcClient)) {
        await opcClient.disconnect();
      }
      opcClient = await getOpcClient();
      opcSession = await opcClient.createSession();
    }
    return opcSession;
  } catch (err) {
    console.error("OPC connection failed. Retrying in 5 seconds...");
    opcSession = null;
    opcClient = null;
    setTimeout(() => ensureSession(), 5000); // Retry
    throw err;
  }
}

// Close the client and session (e.g., when the application ends)
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

// Function that returns the dataType based on the value
function detectDataType(value: any): DataType {
  switch (typeof value) {
    case "boolean":
      return DataType.Boolean;
    case "number":
      return Number.isInteger(value) ? DataType.Int32 : DataType.Double;
    case "string":
      return DataType.String;
    case "object":
      if (value instanceof Date) {
        return DataType.DateTime;
      }
      return DataType.Variant; 

      default:
      throw new Error(`Unsupported data type: ${typeof value}`);
  }
}

export interface WriteItem {
  nodeId: string;
  value: any;
}

export async function writeNodeValues(
  writeItems: WriteItem[]
): Promise<void> {
  await ensureSession(); // Ensure the session exists
  if (!opcSession) {
    throw new Error("OPC session is not initialized");
  }
  console.log(`Writing values to nodes: ${JSON.stringify(writeItems)}`);

  const nodesToWrite = writeItems.map((item) => {
    const dataType = detectDataType(item.value);

    return {
      nodeId: item.nodeId,
      attributeId: AttributeIds.Value,
      value: {
        value: new Variant({
          dataType,
          value: item.value,
        }),
      },
    };
  });
  await opcSession.write(nodesToWrite);
}

process.on("SIGINT", async () => {
  console.log("Closing OPC UA connection...");
  await closeOpcConnection();
  process.exit(0);
});