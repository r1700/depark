// import * as opcua from "node-opcua";
// import { sendLicensePlateToBackend } from "./backendService";

// const client = opcua.OPCUAClient.create({
//   endpoint_must_exist: false
// });

// const endpointUrl = "opc.tcp://<PLC_SERVER_IP>:4840"; // כתובת ה־OPC-UA Server

// async function connectToOpc() {
//   try {
//     await client.connect(endpointUrl);
//     console.log("Successfully connected to OPC-UA server.");
//     await subscribeToNode();
//   } catch (err) {
//     console.log("Connection failed:", err);
//   }
// }

// async function subscribeToNode() {
//   const session = await client.createSession();

//   const subscription = await session.createSubscription2({
//     requestedPublishingInterval: 1000, // כל 1 שנייה
//     requestedLifetimeCount: 60,
//     requestedMaxKeepAliveCount: 10,
//     maxNotificationsPerPublish: 10,
//     publishingEnabled: true
//   });

//   const item = await subscription.monitor(
//     {
//       nodeId: "ns=2;s=LicensePlateInput", // ה־Node שלך
//       attributeId: opcua.AttributeIds.Value
//     },
//     {
//       samplingInterval: 100,
//       discardOldest: true,
//       queueSize: 10
//     },
//     opcua.TimestampsToReturn.Both
//   );

//   item.on("changed", (dataValue) => {
//     console.log("License plate changed:", dataValue.value.value);
//     sendLicensePlateToBackend(dataValue.value.value); // שליחה ל־Backend
//   });
// }

// export {connectToOpc};
import axios from "axios";
import { sendLicensePlateToBackend } from "./backendService";

// כתובת ה-API של ה-mock server שלך
const plcMockUrl = "http://localhost:4080/plc/inputs"; // Endpoint של ה־PLC mock (בהנחה שאתה משתמש בקובץ server.ts)

async function subscribeToPlcMock() {
  let lastLicensePlate = "";

  // כל שנייה נבצע polling כדי לבדוק אם הערכים השתנו
  setInterval(async () => {
    try {
      const response = await axios.get(plcMockUrl);
      const currentLicensePlate = response.data.sensor1;  // אני מניח שזה ה-Node של מספר הרישוי ב־PLC

      // אם הערך השתנה, נשלח אותו ל-Backend
      if (currentLicensePlate !== lastLicensePlate) {
        console.log("License plate changed:", currentLicensePlate);
        sendLicensePlateToBackend(currentLicensePlate);  // שליחה ל-Backend
        lastLicensePlate = currentLicensePlate;
      }
    } catch (error) {
      console.error("Error fetching data from PLC mock:", error);
    }
  }, 1000); // Polling כל שנייה (1000 מ"ל)
}

export { subscribeToPlcMock };
