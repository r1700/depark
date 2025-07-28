import { OPCUAServer, Variant, DataType, StatusCodes } from "node-opcua";
import { plcState } from "../../plc-mock/src/plc-mock";

export async function createOpcUaServer() {
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

  const device = namespace.addObject({
    organizedBy: addressSpace.rootFolder.objects,
    browseName: "PLC",
  });

  // משתני Outputs
  namespace.addVariable({
    componentOf: device,
    browseName: "parkingTypeAvailable",
    nodeId: "ns=1;s=parkingTypeAvailable",
    dataType: "Boolean",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.Boolean, value: plcState.parkingTypeAvailable }),
      set: (variant: Variant) => {
        plcState.parkingTypeAvailable = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  // משתנים נוספים (דוגמה):
  namespace.addVariable({
    componentOf: device,
    browseName: "carInParking",
    nodeId: "ns=1;s=carInParking",
    dataType: "Boolean",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.Boolean, value: plcState.carInParking }),
      set: (variant: Variant) => {
        plcState.carInParking = variant.value;
        return StatusCodes.Good;
      },
    },
  });
   // משתנה נוסף: vehicleEnteredSuccessfully
  namespace.addVariable({
    componentOf: device,
    browseName: "vehicleEnteredSuccessfully",
    nodeId: "ns=1;s=vehicleEnteredSuccessfully",
    dataType: "Boolean",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.Boolean, value: plcState.vehicleEnteredSuccessfully }),
      set: (variant: Variant) => {
        plcState.vehicleEnteredSuccessfully = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  // משתנה נוסף: car
  namespace.addVariable({
    componentOf: device,
    browseName: "car",
    nodeId: "ns=1;s=car",
    dataType: "Boolean",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.Boolean, value: plcState.car }),
      set: (variant: Variant) => {
        plcState.car = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  // משתנה נוסף: sensor1
  namespace.addVariable({
    componentOf: device,
    browseName: "sensor1",
    nodeId: "ns=1;s=sensor1",
    dataType: "Int32",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.Int32, value: plcState.sensor1 }),
      set: (variant: Variant) => {
        plcState.sensor1 = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  // משתנה נוסף: sensor2
  namespace.addVariable({
    componentOf: device,
    browseName: "sensor2",
    nodeId: "ns=1;s=sensor2",
    dataType: "Int32",
    minimumSamplingInterval: 1000,
    value: {
      get: () => new Variant({ dataType: DataType.Int32, value: plcState.sensor2 }),
      set: (variant: Variant) => {
        plcState.sensor2 = variant.value;
        return StatusCodes.Good;
      },
    },
  });

  // הוסיפי משתנים נוספים לפי הצורך...

  await server.start();
  console.log("✅ OPC-UA server running at:", server.endpoints[0].endpointDescriptions()[0].endpointUrl);
}