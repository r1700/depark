import { OPCUAServer, Variant, DataType, StatusCodes } from "node-opcua";
import { log } from "node:console";
// Start an OPC-UA server simulating a PLC
export async function createPlcOpcServer() {
  const server = new OPCUAServer({
    port: 4080,
    resourcePath: "/UA/PLC",
    buildInfo: {
      productName: "PlcMockServer",
      buildNumber: "1",
      buildDate: new Date(),
    },
  });
  await server.initialize();
  const addressSpace = server.engine.addressSpace!;
  const namespace = addressSpace.getOwnNamespace();
  console.log("Adding PLC object under:", addressSpace.rootFolder.objects.nodeId.toString());
  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "PLC",
  });
  console.log("objectsFolder:", addressSpace.rootFolder.objects.nodeId.toString());
  // Internal variables to simulate state
  // Each has its own nodeId
  let licensePlateEntry = "";
  let licensePlateExit = "";
  let parkingSpot = "";
  // Add Outputs variables
  namespace.addVariable({
    componentOf: device,
    browseName: "licensePlateEntry",
    nodeId: "ns=1;s=licensePlateEntry",
    dataType: "String",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.String, value: licensePlateEntry }),
      set: (variant: Variant) => {
        licensePlateEntry = variant.value;
        return StatusCodes.Good;
      },
    },
  });
  namespace.addVariable({
    componentOf: device,
    browseName: "licensePlateExit",
    nodeId: "ns=1;s=licensePlateExit",
    dataType: "String",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.String, value: licensePlateExit }),
      set: (variant: Variant) => {
        licensePlateExit = variant.value;
        return StatusCodes.Good;
      },
    },
  });
  namespace.addVariable({
    componentOf: device,
    browseName: "parkingSpot",
    nodeId: "ns=1;s=parkingSpot",
    dataType: "String",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.String, value: parkingSpot }),
      set: (variant: Variant) => {
        parkingSpot = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  // Function to update values periodically using setInterval
  setInterval(async () => {
    // Trigger value updates for monitored items in OPC-UA server
    licensePlateEntry = `ABC-${Math.floor(Math.random() * 1000)}`;
    licensePlateExit = `XYZ-${Math.floor(Math.random() * 1000)}`;
    parkingSpot = `Spot-${Math.floor(Math.random() * 100)}`;
  }, 2000); // Every 2 seconds

  await server.start();
  console.log(":white_check_mark: OPC-UA server running at:", server.endpoints[0].endpointDescriptions()[0].endpointUrl);
}