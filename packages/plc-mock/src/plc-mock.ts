import { OPCUAServer, Variant, DataType, StatusCodes } from "node-opcua";
// הפעלת שרת OPC-UA המדמה PLC
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
    // nodeId: "ns=1;s=PLC"
  });
  console.log("objectsFolder:", addressSpace.rootFolder.objects.nodeId.toString());
  // משתנים פנימיים לדימוי מצב
  // כל אחד מהם יש לו nodeIdמשלו
  let parkingTypeAvailable = false;
  let carInParking = false;
  let vehicleEnteredSuccessfully = false;
  // let valve1 = false;
  // let valve2 = false;
  // let valve3 = false;
  // let valve4 = false;
  let car= false;
  let sensor1 = 0;
  let sensor2 = 0;
  // הוספת משתני Outputs
  namespace.addVariable({
  componentOf: device,
  browseName: "parkingTypeAvailable",
  nodeId: "ns=1;s=parkingTypeAvailable",
  dataType: "Boolean",
  minimumSamplingInterval: 1000, // ← Required when using get
  value: {
    get: () => {
      const value = true;
      return new Variant({ dataType: DataType.Boolean, value: parkingTypeAvailable});
    },
    set: (variant: Variant) => {
      parkingTypeAvailable = variant.value;
      return StatusCodes.Good;
    },
  },
});
  namespace.addVariable({
  componentOf: device,
  browseName: "carInParking",
   nodeId: "ns=1;s=carInParking",
  dataType: "Boolean",
  minimumSamplingInterval: 1000, // ← נדרש בעת שימוש ב-get
  value: {
    get: () => {
      const value = true;
      return new Variant({ dataType: DataType.Boolean, value:carInParking });
    },
    set: (variant: Variant) => {
      carInParking = variant.value;
      return StatusCodes.Good;
    },
  },
});
  namespace.addVariable({
  componentOf: device,
  browseName: "vehicleEnteredSuccessfully",
   nodeId: "ns=1;s=vehicleEnteredSuccessfully",
  dataType: "Boolean",
  minimumSamplingInterval: 1000, // ← נדרש בעת שימוש ב-get
  value: {
    get: () => {
      const value = true;
      return new Variant({ dataType: DataType.Boolean, value:vehicleEnteredSuccessfully });
    },
    set: (variant: Variant) => {
      vehicleEnteredSuccessfully = variant.value;
      return StatusCodes.Good;
    },
  },
});
namespace.addVariable({
  componentOf: device,
  browseName: "car",
   nodeId: "ns=1;s=car",
  dataType: "Boolean",
  minimumSamplingInterval: 1000, // ← נדרש בעת שימוש ב-get
  value: {
    get: () => {
      const value = true;
      return new Variant({ dataType: DataType.Boolean, value :car});
    },
    set: (variant: Variant) => {
      car = variant.value;
      return StatusCodes.Good;
    },
  },
});
  await server.start();
  console.log(":white_check_mark: OPC-UA server running at:", server.endpoints[0].endpointDescriptions()[0].endpointUrl);
}

