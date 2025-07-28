const opcua = require("node-opcua");

const server = new opcua.OPCUAServer({
    port: process.env.PORT_SERVER || 5000,
    alternateHostname: "localhost",
    resourcePath: "/UA/MyServer",
    buildInfo: {
        productName: "My OPC UA Server",
        buildNumber: "1.0.0",
        buildDate: new Date()
    }
});

async function startServer() {
    await server.initialize();
    console.log("שרת OPC UA מוכן לפעולה");

    const addressSpace = server.engine.addressSpace;
    const namespace = addressSpace.getOwnNamespace();

    const myObject = namespace.addObject({
        browseName: "MyObject"
    });

    namespace.addVariable({
        componentOf: myObject,
        browseName: "MyVariable",
        dataType: "Double",
        value: {
            get: function () {
                return new opcua.Variant({ dataType: opcua.DataType.Double, value: Math.random() });
            }
        }
    });

    await server.start();
    console.log("שרת OPC UA פועל על פורט 5000");

// ✅ Check if the server is listening on non-local addresses   
  const sockets = server.endpoints[0]._transportSockets;
    for (const s of sockets) {
        if (!s.address().address.includes("127.0.0.1")) {
            console.warn("❌ אזהרה: השרת מאזין גם לכתובות לא-מקומיות");
        }
    }
}

startServer().catch(err => {
    console.error("שגיאה בהפעלה:", err);
});
