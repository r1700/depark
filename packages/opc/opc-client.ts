import express, { Request, Response } from 'express';
import {
  OPCUAClient,
  AttributeIds,
  DataType,
  ClientSession,
  ReadValueIdOptions,
  DataValue
} from 'node-opcua';

const app = express();
app.use(express.json());

const endpointUrl: string = "opc.tcp://localhost:4080/UA/PLC";

// Multiple nodeIds read
export async function readNodeValues(
  session: ClientSession,
  nodeIds: string[]
): Promise<{ nodeId: string; value: any }[]> {
  const nodesToRead: ReadValueIdOptions[] = nodeIds.map(nodeId => ({
    nodeId,
    attributeId: AttributeIds.Value
  }));

  const results: DataValue[] = await session.read(nodesToRead);

  return results.map((res, i) => ({
    nodeId: nodeIds[i],
    value: res.value?.value
  }));
}

// Multiple nodeIds write
interface WriteItem {
  nodeId: string;
  value: boolean;
}

export async function writeNodeValues(
  session: ClientSession,
  writeItems: WriteItem[]
): Promise<void> {
  const nodesToWrite = writeItems.map(item => ({
    nodeId: item.nodeId,
    attributeId: AttributeIds.Value,
    value: {
      value: {
        dataType: DataType.Boolean,
        value: item.value
      }
    }
  }));

  await session.write(nodesToWrite);
}

// GET /plc/read?ids=...
app.get('/plc/read', async (req: Request, res: Response) => {
  const idsParam = req.query.ids?.toString();
  const nodeIds: string[] = idsParam ? idsParam.split(',') : [];

  const client = OPCUAClient.create({ endpointMustExist: false });

  try {
    await client.connect(endpointUrl);
    const session: ClientSession = await client.createSession();

    const values = await readNodeValues(session, nodeIds);

    await session.close();
    await client.disconnect();

    res.json(values);
  } catch (err: any) {
    res.status(500).send(err.message || "Unknown error");
  }
});

// POST /plc/write
app.post('/plc/write', async (req: Request, res: Response) => {
  const writeItems: WriteItem[] = req.body;

  const client = OPCUAClient.create({ endpointMustExist: false });

  try {
    await client.connect(endpointUrl);
    const session: ClientSession = await client.createSession();

    await writeNodeValues(session, writeItems);

    await session.close();
    await client.disconnect();

    res.send("Values updated");
  } catch (err: any) {
    res.status(500).send(err.message || "Unknown error");
  }
});

app.listen(5000, () => {
  console.log("Server is running at http://localhost:5000");
});
