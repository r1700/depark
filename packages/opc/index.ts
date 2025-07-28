import { createOpcUaServer } from "./src/opc-server";
import app from "./app"; // ודאי ש־app.ts מייצא את ה־express app שלך
import dotenv from "dotenv";
dotenv.config();
const {PORT} = process.env || 5000;

async function startAll() {
  await createOpcUaServer();
  app.listen(PORT, () => {
    console.log(`API server running on port ${PORT}`);
  });
}

startAll();