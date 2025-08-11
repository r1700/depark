import {
  OPCUAClient,
  AttributeIds,
  DataType,
  ClientSession,
  DataValue,
  ClientSubscription,
  ClientMonitoredItem,
  TimestampsToReturn,
  StatusCodes,
  UserTokenType,
  MessageSecurityMode,
  SecurityPolicy 
} from "node-opcua";

import { sendDataToBackend } from "./backendService";
import * as dotenv from 'dotenv';
dotenv.config();

// const ENDPOINT_URL =`opc.tcp://${process.env.TARGET_URL || "localhost:4080"}/UA/PLC`;
const ENDPOINT_URL = `opc.tcp://${process.env.TARGET_URL || "localhost"}:4840/UA/PLC`;

let opcClient: OPCUAClient | null = null;
let opcSession: ClientSession | null = null;
let subscription: ClientSubscription | null = null;
let monitoredItems: ClientMonitoredItem[] = [];
let isSessionActive = false;

const nodesToMonitor = [
  "ns=1;s=parkingSpot",
  "ns=1;s=licensePlateExit",
  "ns=1;s=licensePlateEntry",
]

function guessDataType(value: any): DataType {
  switch (typeof value) {
    case "boolean":
      return DataType.Boolean;
    case "number":
      return Number.isInteger(value) ? DataType.Int32 : DataType.Double;
    case "string":
      return DataType.String;
    default:
      return DataType.Null;
  }
}

async function getOpcClient(): Promise<OPCUAClient> {
  if (opcClient) {
    return opcClient;
  }

  opcClient = OPCUAClient.create({ 
    endpointMustExist: false ,
    securityMode: MessageSecurityMode.None,
    securityPolicy: SecurityPolicy.None,});

  opcClient.on("backoff", (retry, delay) => {
    console.warn(`Retrying OPC UA Server connection - attempt #${retry} in ${delay}ms`);
  });

  try {
    await opcClient.connect(ENDPOINT_URL);
    console.log("✅ Connected to OPC UA Server");
    return opcClient;
  } catch (err) {
    opcClient = null;
    console.error("❌ Connection failed:", err);
    throw err;
  }
}

export async function ensureSession(): Promise<ClientSession> {
  if (opcSession && opcSession.sessionId && isSessionActive) {
    return opcSession;
  }

  try {
    const client = await getOpcClient();

    opcSession = await client.createSession({
      type: UserTokenType.UserName,
      userName: process.env.OPCUA_USERNAME || "TestUser",
      password: process.env.OPCUA_PASSWORD || "Interpaz1234!"
    });

    isSessionActive = true;
    console.log("✅ Session created");
    return opcSession;
  } catch (err) {
    console.error("❌ Error creating session:", err);
    throw err;
  }
}

async function createSubscription(session: ClientSession): Promise<ClientSubscription> {
  if (subscription) {
    try {
      await subscription.terminate();
      console.log("✅ Previous subscription terminated");
    } catch (e) {
      console.warn("⚠️ Warning terminating subscription:", e);
    }
    subscription = null;
  }

  subscription = ClientSubscription.create(session, {
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
    // console.log("Subscription keepalive");
  });

  subscription.on("status_changed", (status) => {
    console.log("Subscription status changed:", status.toString());
  });

  return subscription;
}

async function createMonitoredItems(subscription: ClientSubscription) {
  // Cleanup previous monitored items
  for (const item of monitoredItems) {
    try {
      await item.terminate();
    } catch (e) {
      console.warn("Warning terminating monitored item:", e);
    }
  }
  monitoredItems = [];

  nodesToMonitor.forEach((nodeId) => {
    const monitoredItem = ClientMonitoredItem.create(
      subscription,
      {
        nodeId,
        attributeId: AttributeIds.Value,
      },
      {
        samplingInterval: 100,
        discardOldest: true,
        queueSize: 10,
      },
      TimestampsToReturn.Both
    );

    monitoredItem.on("changed", (dataValue: DataValue) => {
      const val = dataValue.value?.value;
      console.log(`💡 Value changed for ${nodeId}:`, val);
      sendDataToBackend(nodeId, val);
    });

    monitoredItem.on("err", (err) => {
      console.error(`Monitored item error at ${nodeId}:`, err);
    });

    monitoredItems.push(monitoredItem);
  });
}

export interface WriteItem {
  nodeId: string;
  value: any;
  dataType?: DataType;
}

export async function writeNodeValues(
  session: ClientSession,
  writeItems: WriteItem[]
): Promise<void> {
  const nodesToWrite = writeItems.map((item) => ({
    nodeId: item.nodeId,
    attributeId: AttributeIds.Value,
    value: {
      value: {
        dataType: item.dataType ?? guessDataType(item.value),
        value: item.value,
      },
    },
  }));

  try {
    const statusCodes = await session.write(nodesToWrite);
    statusCodes.forEach((status, i) => {
      if (status !== StatusCodes.Good) {
        console.warn(`⚠️ Failed to write to node ${writeItems[i].nodeId}: ${status.toString()}`);
      }
    });
  } catch (err) {
    console.error("❌ Error writing OPC UA nodes:", err);
    throw err;
  }
}

export async function closeOpcConnection() {
  try {
    for (const item of monitoredItems) {
      try {
        await item.terminate();
      } catch (e) {
        console.warn("⚠️ Warning terminating monitored item:", e);
      }
    }
    monitoredItems = [];

    if (subscription) {
      try {
        await subscription.terminate();
        console.log("✅ Subscription terminated");
      } catch (err) {
        console.warn("⚠️ Warning terminating subscription:", err);
      }
      subscription = null;
    }

    if (opcSession) {
      try {
        await opcSession.close();
        console.log("✅ Session closed");
        isSessionActive = false;
      } catch (err) {
        console.warn("⚠️ Warning closing session:", err);
      }
      opcSession = null;
    }

    if (opcClient) {
      try {
        await opcClient.disconnect();
        console.log("✅ Client disconnected");
      } catch (err) {
        console.warn("⚠️ Warning disconnecting client:", err);
      }
      opcClient = null;
    }
  } catch (err) {
    console.error("❌ Error during OPC UA connection close:", err);
  }
}

function wait(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function startOpcClientWithReconnect() {
  const MAX_RECONNECT_ATTEMPTS = 10;
  const BASE_DELAY_MS = 5000;

  let attempt = 0;

  while (attempt < MAX_RECONNECT_ATTEMPTS) {
    try {
      attempt++;
      console.log(`🔄 OPC UA connection attempt ${attempt}`);

      const session = await ensureSession();
      const sub = await createSubscription(session);
      await createMonitoredItems(sub);

      console.log("✅ OPC UA client started successfully");

      // Reset attempt after success
      attempt = 0;

      // Wait until connection lost or subscription terminated
      await new Promise<void>((resolve) => {
        if (!opcClient) {
          return resolve();
        }

        opcClient.once("connection_lost", () => {
          console.warn("⚠️ OPC UA client connection lost event");
          resolve();
        });

        opcClient.once("close", () => {
          console.warn("⚠️ OPC UA client close event");
          resolve();
        });

        subscription?.once("terminated", () => {
          console.warn("⚠️ OPC UA subscription terminated");
          resolve();
        });
      });

      console.log(`🔄 OPC UA client disconnected, closing resources and will retry after backoff`);

      await closeOpcConnection();

      const backoffMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`⏳ Waiting ${backoffMs / 1000} seconds before reconnect`);
      await wait(backoffMs);
    } catch (err) {
      console.error("❌ OPC UA reconnect error:", err);

      const backoffMs = BASE_DELAY_MS * Math.pow(2, attempt - 1);
      console.log(`⏳ Waiting ${backoffMs / 1000} seconds before retry`);
      await wait(backoffMs);
    }
  }

  console.error("❌ Max reconnect attempts reached, giving up");
}

process.on("SIGINT", async () => {
  console.log("🛑 SIGINT received. Shutting down OPC UA client...");
  await closeOpcConnection();
  process.exit(0);
});

startOpcClientWithReconnect().catch((err) => {
  console.error("Critical error in OPC UA client:", err);
  process.exit(1);
});