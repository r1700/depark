import {
  OPCUAClient,
  AttributeIds,
  DataType,
  ClientSession,
  ClientMonitoredItem,
  ClientSubscription,
  DataValue,
  TimestampsToReturn,
  Variant,
  VariantArrayType,
  UserTokenType,
  MessageSecurityMode,
  SecurityPolicy
} from "node-opcua";
import dotenv from "dotenv";
import { sendDataToBackend } from "./backendService";

dotenv.config();
const { TARGET_URL, PLC_USERNAME, PLC_PASSWORD, TARGET_URL_MOCK } = process.env;

// עדיף לשים את ה־endpoint מה־.env
const endpointUrl: string = `opc.tcp://${TARGET_URL}/UA/PLC`;

let opcClient: OPCUAClient | null = null;
let opcSession: ClientSession | null = null;
let subscription: ClientSubscription | null = null;
let monitoredItems: ClientMonitoredItem[] = [];
const nodesToMonitor = [
  "ns=1;s=parkingSpot",
  "ns=1;s=licensePlateExit",
  "ns=1;s=licensePlateEntry",
  "ns=1;s=ActiveFaultList", // רשימת תקלות
  "ns=1;s=Queue",
];

// ----------------------------
// Helpers
// ----------------------------
function isChannelValid(session: ClientSession | null): boolean {
  return session ? session.sessionId !== null : false;
}

function isConnected(client: OPCUAClient | null): boolean {
  return client ? client.connectionStrategy.maxRetry === 0 : false;
}

// ----------------------------
// Client / Session Management
// ----------------------------
async function getOpcClient(): Promise<OPCUAClient> {
  if (!opcClient) {
    opcClient = OPCUAClient.create({
      // endpointMustExist: false,
      // securityMode: MessageSecurityMode.Sign,
      // securityPolicy: SecurityPolicy.Basic256Sha256,
      // connectionStrategy: {
      //   initialDelay: 1000,
      //   maxRetry: 3,
      // },
    });
    try {
      await opcClient.connect(endpointUrl);
      console.log(`Connected to OPC UA server at ${endpointUrl}`);
    } catch (err) {
      console.error("Failed to connect to OPC UA server:", err);
      throw err;
    }
  }
  return opcClient;
}

// Ensure a valid session
export async function ensureSession(): Promise<ClientSession> {
  try {
    if (!opcSession || !isChannelValid(opcSession)) {
      if (opcClient && isConnected(opcClient)) {
        await opcClient.disconnect();
        console.log("Disconnected inactive OPC UA client");
      }
      opcClient = await getOpcClient();
      opcSession = await opcClient.createSession(
        // {
        //   type: UserTokenType.UserName,
        //   userName: PLC_USERNAME || "TestUser",
        //   password: PLC_PASSWORD || "Interpaz1234!",
        // }
      );
      console.log("OPC UA session created");
    }

    const client = await getOpcClient();
    await client.connect(endpointUrl);
    console.log("✅ Connected to OPC UA server");

    opcSession = await client.createSession({
      type: UserTokenType.UserName,
      userName: PLC_USERNAME || "",
      password: PLC_PASSWORD || "",
    });

    console.log("✅ Session created");
    return opcSession;
  } catch (err) {
    console.error("❌ OPC connection failed. Retrying in 5s...", err);
    opcSession = null;
    opcClient = null;
    setTimeout(() => ensureSession(), 5000);
    throw err;
  }
}

// Close the OPC UA connection
async function closeOpcConnection(): Promise<void> {
  if (opcSession) {
    await opcSession.close();
    console.log("OPC UA session closed");
    opcSession = null;
  }
  if (opcClient) {
    await opcClient.disconnect();
    console.log("OPC UA client disconnected");
    opcClient = null;
  }
}

// ----------------------------
// Write Support
// ----------------------------
function detectDataType(value: any): { dataType: DataType; arrayType?: VariantArrayType } {
  if (Array.isArray(value)) {
    const elementType = typeof value[0];
    switch (elementType) {
      case "boolean":
        return { dataType: DataType.Boolean, arrayType: VariantArrayType.Array };
      case "number":
        return { dataType: Number.isInteger(value[0]) ? DataType.Int32 : DataType.Double, arrayType: VariantArrayType.Array };
      case "string":
        return { dataType: DataType.String, arrayType: VariantArrayType.Array };
      default:
        throw new Error(`Unsupported array element type: ${elementType}`);
    }
  }

  switch (typeof value) {
    case "boolean":
      return { dataType: DataType.Boolean };
    case "number":
      return { dataType: Number.isInteger(value) ? DataType.Int32 : DataType.Double };
    case "string":
      return { dataType: DataType.String };
    case "object":
      if (value instanceof Date) {
        return { dataType: DataType.DateTime };
      }
      throw new Error("Unsupported object type");
    default:
      throw new Error(`Unsupported data type: ${typeof value}`);
  }
}

// Interface for write items
export interface WriteItem {
  nodeId: string;
  value: any;
}

// Write values to OPC UA nodes
export async function writeNodeValues(writeItems: WriteItem[]): Promise<void> {
  await ensureSession();
  if (!opcSession) {
    throw new Error("OPC session is not initialized");
  }

  const nodesToWrite = writeItems.map((item) => {
    const dataType: any = detectDataType(item.value);
    return {
      nodeId: item.nodeId,
      attributeId: AttributeIds.Value,
      value: {
        value: new Variant({
          ...dataType,
          value: item.value,
        }),
      }
    };
  });

  try {
    console.log("Writing nodes:", JSON.stringify(nodesToWrite, null, 2));
    await opcSession.write(nodesToWrite);
    console.log("Write successful");
  } catch (err) {
    console.error("Failed to write nodes:", err);
    throw err;
  }
}

// Create a subscription
export async function createSubscription(): Promise<ClientSubscription> {
  if (subscription) {
    try {
      await subscription.terminate();
      console.log("✅ Previous subscription terminated");
    } catch (e) {
      console.warn("⚠️ Warning terminating subscription:", e);
    }
    subscription = null;
  }

  await ensureSession(); // Ensure the session exists
  console.log("Creating OPC UA subscription...");
  if (!opcSession) {
    throw new Error("OPC session is not initialized");
  }

  subscription = ClientSubscription.create(opcSession, {
    requestedPublishingInterval: 500,
    requestedLifetimeCount: 100,
    requestedMaxKeepAliveCount: 10,
    maxNotificationsPerPublish: 10,
    publishingEnabled: true,
    priority: 10,
  });

  subscription.on("started", () => {
    console.log(`Subscription started (ID=${subscription!.subscriptionId})`);
  });

  subscription.on("terminated", () => {
    console.log("Subscription terminated");
  });

  subscription.on("keepalive", () => {
    console.log("🔄 Subscription keepalive: Connection is active");
  });

  subscription.on("status_changed", (status) => {
    console.log("⚠️ Subscription status changed:", status.toString());
  });

  return subscription;
}

export async function createMonitoredItems(subscription: ClientSubscription): Promise<void> {
  // Cleanup previous monitored items
  for (const item of monitoredItems) {
    try {
      await item.terminate();
    } catch (e) {
      console.warn("⚠️ Warning terminating monitored item:", e);
    }
  }
  monitoredItems = [];

  nodesToMonitor.forEach((nodeId) => {
    const monitoredItem = ClientMonitoredItem.create(
      subscription,
      { nodeId, attributeId: AttributeIds.Value },
      { samplingInterval: 100, discardOldest: true, queueSize: 10 },
      TimestampsToReturn.Both
    );

    monitoredItem.on("changed", async (dataValue: DataValue) => {
      const val = dataValue.value?.value;
      let event: string = '';
      let payload: any = {};
      if (nodeId === "ns=1;s=licensePlateExit") {
        event = 'exit';
      } else if (nodeId === "ns=1;s=licensePlateEntry") {
        event = 'entry';
      } else if (nodeId === "ns=1;s=parkingSpot") {
        event = 'parkingSpot';
      }
      else if (nodeId === "ns=1;s=Queue") {
        event = 'Queue';
      }
      else if (nodeId === "ns=1;s=ActiveFaultList") {
        event = 'fault';
      }
      console.log(`🔄 Node ${nodeId} changed:`, val);
      await sendDataToBackend(event, val);
    });

    monitoredItem.on("err", (err) => {
      console.error(`❌ Monitored item error at ${nodeId}:`, err);
    });

    monitoredItems.push(monitoredItem);
  });
}

export async function waitForNodeChange(
  nodeId: string,
  options: {
    samplingInterval?: number;
    timeout?: number;
    predicate?: (v: any, dv?: DataValue) => boolean;
  } = {}
): Promise<any> {
  const { samplingInterval = 100, timeout = 10000, predicate } = options;

  return new Promise((resolve, reject) => {
    const monitoredItem = ClientMonitoredItem.create(
      subscription!,
      { nodeId, attributeId: AttributeIds.Value },
      { samplingInterval, discardOldest: true, queueSize: 1 },
      TimestampsToReturn.Both
    );

    const timer = setTimeout(() => {
      monitoredItem.terminate().catch(() => { });
      reject(new Error("Timeout waiting for node change"));
    }, timeout);

    monitoredItem.on("changed", (dataValue: DataValue) => {
      const val = dataValue.value?.value;
      const ok = typeof predicate === "function" ? predicate(val, dataValue) : true;
      if (ok) {
        clearTimeout(timer);
        monitoredItem.terminate().catch(() => { });
        resolve(val);
      }
    });

    monitoredItem.on("err", (err: any) => {
      clearTimeout(timer);
      monitoredItem.terminate().catch(() => { });
      reject(err);
    });
  });
}

process.on("SIGINT", async () => {
  console.log("Closing OPC UA connection...");
  await closeOpcConnection();
  process.exit(0);
});

