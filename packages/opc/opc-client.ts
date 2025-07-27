import { OPCUAClient } from "node-opcua";
import dotenv from "dotenv";

dotenv.config();

const endpointUrl = process.env.OPCUA_ENDPOINT || "opc.tcp://localhost:5000";
const client = OPCUAClient.create({ endpointMustExist: false });

// Creates an OPC-UA client instance with the ability to verify the existence of the server address.
async function main() {
  try {
    console.log("🔄 Connecting to OPC-UA server:", endpointUrl);
    
    await client.connect(endpointUrl);
    
    console.log("✅ Connected to OPC-UA server:", endpointUrl);


    await client.disconnect();
    console.log("🔌 Disconnected from OPC-UA server");
  } catch (err) {
    console.error("❌ OPC-UA connection error:", err);
  }
}



import axios from 'axios';

async function readPLCState() {
  const res = await axios.get('http://localhost:4080/plc/inputs');
  console.log(res.data);
}
async function postPLCState() {
   await axios.post('http://localhost:4080/plc/output', {

});
}

main().catch(console.error);
export { readPLCState }; 
export { postPLCState }; 
   