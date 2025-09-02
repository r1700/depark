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
      applicationName: "ParkingSystemClient",
      connectionStrategy: {
        initialDelay: 1000,
        maxRetry: 10,
      },
      securityMode: MessageSecurityMode.None,
      securityPolicy: SecurityPolicy.None,
    });
  }
  return opcClient;
}

export async function ensureSession(): Promise<ClientSession> {
  try {
    if (opcSession && isChannelValid(opcSession)) {
      return opcSession;
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

async function closeOpcConnection() {
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
      if (value instanceof Date) return { dataType: DataType.DateTime };
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

export async function writeNodeValues(writeItems: WriteItem[]): Promise<void> {
  const nodesToWrite = writeItems.map((item) => {
    const dataType: any = detectDataType(item.value);
    return {
      nodeId: item.nodeId,
      attributeId: AttributeIds.Value,
      value: new Variant({
        ...dataType,
        value: item.value,
      }),
    };
  });

  console.log(`Nodes to write: ${JSON.stringify(nodesToWrite)}`);
  await opcSession!.write(nodesToWrite);
}

// ----------------------------
// Subscription + Monitoring
// ----------------------------
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

  await ensureSession();
  if (!opcSession) throw new Error("OPC session not initialized");

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

  return subscription;
}

export async function createMonitoredItems(subscription: ClientSubscription) {
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
        payload = { value: val };
      } else if (nodeId === "ns=1;s=licensePlateEntry") {
        event = 'entry';
        payload = { value: val };
      } else if (nodeId === "ns=1;s=parkingSpot") {
        event = 'parkingSpot';
        payload = { value: val };
      } else if (nodeId === "ns=1;s=ActiveFaultList") {
          event = 'fault';
          let faultObj = val;
          if (typeof val === "string") {
            try {
              faultObj = JSON.parse(val);
            } catch (e) {
              console.warn("ActiveFaultList value is not valid JSON:", val);
              return;
            }
          }
          if (faultObj && typeof faultObj === "object") {
            console.log("ActiveFaultList changed:", faultObj);
            payload = {
              parkingId: faultObj.parkingId,
              faultDescription: faultObj.faultDescription,
              severity: faultObj.severity || "medium",
              assigneeId: faultObj.assigneeId ?? null,
            };
          } else {
            return;
          }
        } else {
          return; // Unknown nodeId, do nothing
        }

      sendDataToBackend(event, payload);
    });

    monitoredItem.on("err", (err) => {
      console.error(`❌ Monitored item error at ${nodeId}:`, err);
    });

    monitoredItems.push(monitoredItem);
  });
}

// ----------------------------
// Wait for single node change
// ----------------------------
export async function waitForNodeChange(
  nodeId: string,
  options: { samplingInterval?: number; timeout?: number; predicate?: (v: any, dv?: DataValue) => boolean } = {}
): Promise<any> {
  const { samplingInterval = 100, timeout = 5000, predicate } = options;

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

// ----------------------------
process.on("SIGINT", async () => {
  console.log("Closing OPC UA connection...");
  await closeOpcConnection();
  process.exit(0);
});

