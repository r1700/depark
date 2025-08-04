import express, { Request, Response } from 'express';
import { 
  ensureSession, 
  writeNodeValues, 
  closeOpcConnection, 
  WriteItem 
} from './opc-client'; 
import { ClientSession } from 'node-opcua';

const app = express();
app.use(express.json());

app.post('/plc/write', async (req: Request, res: Response) => {
  const writeItems: WriteItem[] = req.body;

  if (!writeItems || !Array.isArray(writeItems)) {
    return res.status(400).json({ error: "Invalid format, expected array" });
  }

  try {
    const session: ClientSession = await ensureSession();
    await writeNodeValues(session, writeItems);
    res.json({ message: "Values updated successfully" });
  } catch (error: any) {
    console.error("Write error:", error);
    res.status(500).json({ error: error.message || "Internal error" });
  }
});

process.on('SIGINT', async () => {
  try {
    console.log("Closing OPC UA connection...");
    await closeOpcConnection();
    console.log("Connection closed.");
  } catch (error) {
    console.warn("Error closing connection:", error);
  } finally {
    process.exit(0);
  }
});
//check if opc know when plc changes---only to checking
    import { DataValue } from 'node-opcua';

app.get('/plc/read', async (req: Request, res: Response) => {
  try {
    const session: ClientSession = await ensureSession();
    const nodeId = "ns=1;s=parkingSpot"; 
const value: DataValue = await session.readVariableValue(nodeId);
console.log("Value read from PLC:", value.value.value);



    res.json({ value: value.value });
  } catch (error: any) {
    console.error("Read error:", error);
    res.status(500).json({ error: error.message || "Internal error" });
  }
});

export default app;