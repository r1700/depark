import { OPCUAServer, Variant, DataType, StatusCodes ,VariantArrayType} from "node-opcua";

//----------------------------
// Start an OPC-UA server simulating a PLC
export async function createPlcOpcServer() {
  // Added userManager and allowAnonymous to require username and password
  const server = new OPCUAServer({
    port: 4080,
    resourcePath: "/UA/PLC",
    buildInfo: {
      productName: "PlcMockServer",
      buildNumber: "1",
      buildDate: new Date(),
    },
    userManager: {
      isValidUser: (username: string, password: string): boolean => {
        // Define allowed username and password here
        return username === "TestUser" && password === "Interpaz1234!";
      },
    },
    allowAnonymous: false, // Username and password are required
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
  // Internal variables to simulate PLC state
  let licensePlateEntry = "";
  let licensePlateExit = "";
  let parkingSpot = "";
  let vehicleExitRequest = ["", "", ""];
  let exitRequestApproval = ["", "", ""];
  let queue = ["", "", ""];

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
    browseName: "ExitRequestApproval",
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


  namespace.addVariable({
    componentOf: device,
    browseName: "queue",
    nodeId: "ns=1;s=queue",
    dataType: "String", // סוג הנתונים הוא מחרוזת
    minimumSamplingInterval: 1000,
    value: {
      // בעת קריאה, המערך יוחזר ישירות
      get: () => new Variant({
        dataType: DataType.String,
        arrayType: VariantArrayType.Array, // מציין שזה מערך
        value: queue,
      }),
      // בעת כתיבה, הערך המתקבל יומר למערך
      set: (variant: Variant) => {
        if (Array.isArray(variant.value) && variant.value.every(v => typeof v === "string")) {
          queue = variant.value;
          console.log("queue updated:", queue); // לוג לערך החדש
          return StatusCodes.Good;
        } else {
          console.error("Invalid data format for queue. Expected an array of strings.");
          return StatusCodes.BadInvalidArgument;
        }
      },
    },
  });
  function generateQueueData() {
  const floors = [1, 2, 3, 4, 5, 6];
  const queueData = floors.map(floor => {
    const elevators = [];
    for (let elevator = 1; elevator <= 6; elevator++) {
      // מספר ממתינים אקראי (1-5)
      const waitingCount = Math.floor(Math.random() * 5) + 1;
      // לוחית רישוי אקראית
      const licensePlate = `LP${floor}${elevator}${Math.floor(Math.random() * 10000)}`;
      // כל מעלית: [לוחית רישוי, מספר ממתינים]
      elevators.push([licensePlate, waitingCount]);
    }
    // כל קומה: [מספר קומה, [מעליות]]
    return [floor, elevators];
  });
  return queueData;
}

  

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

  setInterval(() => {
    // Update the queue with new values
    queue = generateQueueData().map(item => JSON.stringify(item));
    console.log("queue updated:", queue);
  }, 30000);
  
//----------------------------------
  await server.start();
  console.log(":white_check_mark: OPC-UA server running at:", server.endpoints[0].endpointDescriptions()[0].endpointUrl);
}