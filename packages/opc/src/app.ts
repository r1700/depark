import express, { Request, Response } from 'express';
import { OPCUAClient, ClientSession, AttributeIds, DataType } from 'node-opcua';
import { readNodeValues, writeNodeValues ,WriteItem ,  getOpcSession} from './opc-client';


const app = express();
app.use(express.json());
const endpointUrl = "opc.tcp://localhost:4080/UA/PLC";


// GET /plc/read?ids=...
app.get('/plc/read', async (req: Request, res: Response) => {
  const idsParam = req.query.ids?.toString();
  const nodeIds: string[] = idsParam ? idsParam.split(',') : [];
  try {
    const session = await getOpcSession(); // שימוש ב-Session משותף
    const values = await readNodeValues(session, nodeIds);
    res.json(values);
  } catch (err: any) {
    res.status(500).send(err.message || "Unknown error");
  }
});

// POST /plc/write
app.post('/plc/write', async (req: Request, res: Response) => {
  const writeItems: WriteItem[] = req.body;
  try {
    const session = await getOpcSession(); // שימוש ב-Session משותף
    await writeNodeValues(session, writeItems);
    res.send("Values updated");
  } catch (err: any) {
    res.status(500).send(err.message || "Unknown error");
  }
});

export default app;