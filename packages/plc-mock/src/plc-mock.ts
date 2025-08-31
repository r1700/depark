import { OPCUAServer, Variant, DataType, StatusCodes ,VariantArrayType} from "node-opcua";
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
  let vehicleExitRequest = ["", "", ""];
  //{ licensePlate: "", undergroundSpot: "", CustomerLocation: "" };
  let exitRequestApproval = ["", "", ""];
  //{ licensePlate: "", position: "", assignedPickupSpot: "" };
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

  namespace.addVariable({
    componentOf: device,
    browseName: "VehicleExitRequest",
    nodeId: "ns=1;s=VehicleExitRequest",
    dataType: "String", // סוג הנתונים הוא מחרוזת
    minimumSamplingInterval: 1000,
    value: {
      // בעת קריאה, המערך יוחזר ישירות
      get: () => new Variant({
        dataType: DataType.String,
        arrayType: VariantArrayType.Array, // מציין שזה מערך
        value: vehicleExitRequest,
      }),
      // בעת כתיבה, הערך המתקבל יומר למערך
      set: (variant: Variant) => {
        if (Array.isArray(variant.value) && variant.value.every(v => typeof v === "string")) {
          vehicleExitRequest = variant.value;
          console.log("VehicleExitRequest updated:", vehicleExitRequest); // לוג לערך החדש
          return StatusCodes.Good;
        } else {
          console.error("Invalid data format for VehicleExitRequest. Expected an array of strings.");
          return StatusCodes.BadInvalidArgument;
        }
      },
    },
  });
  
  namespace.addVariable({
    componentOf: device,
    browseName: "licensePlateEntry = `ABC-${Math.floor(Math.random() * 1000)}`",
    nodeId: "ns=1;s=ExitRequestApproval",
    dataType: "String", // סוג הנתונים הוא מחרוזת
    minimumSamplingInterval: 1000,
    value: {
      // בעת קריאה, המערך יוחזר ישירות
      get: () => new Variant({
        dataType: DataType.String,
        arrayType: VariantArrayType.Array, // מציין שזה מערך
        value: exitRequestApproval,
      }),
      // בעת כתיבה, הערך המתקבל יומר למערך
      set: (variant: Variant) => {
        if (Array.isArray(variant.value) && variant.value.every(v => typeof v === "string")) {
          exitRequestApproval = variant.value;
          console.log("ExitRequestApproval updated:", exitRequestApproval); // לוג לערך החדש
          return StatusCodes.Good;
        } else {
          console.error("Invalid data format for ExitRequestApproval. Expected an array of strings.");
          return StatusCodes.BadInvalidArgument;
        }
      },
    },
  });
  
  

  // Function to update values periodically using setInterval
  setInterval(async () => {
    // Trigger value updates for monitored items in OPC-UA server
    // licensePlateEntry = `ABC-${Math.floor(Math.random() * 1000)}`;
    // licensePlateExit = `XYZ-${Math.floor(Math.random() * 1000)}`;
    // parkingSpot = `Spot-${Math.floor(Math.random() * 100)}`;
    exitRequestApproval = [
      `ABC-${Math.floor(Math.random() * 1000)}`, // licensePlate
      `${Math.floor(Math.random() * 10)}`, // position
      `${Math.floor(Math.random() * 5)}:${Math.floor(Math.random() * 5)}` // assignedPickupSpot
    ];
  }, 2000); // Every 2 seconds

  await server.start();
  console.log(":white_check_mark: OPC-UA server running at:", server.endpoints[0].endpointDescriptions()[0].endpointUrl);
}