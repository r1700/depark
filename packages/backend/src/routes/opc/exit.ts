import { wss } from '../../index';
console.log('exit.ts loaded!');
import { Router } from 'express';
import fs from 'fs';
const router: Router = Router();

router.post('/', (req, res) => {
  console.log('-----------------------------------------------------');
  
  console.log('POST /WriteQueue called!!!!!!!!!!');
  const data = req.body.value || [];
  try {
    fs.writeFileSync(
      __dirname + '/parsedData.json',
      JSON.stringify(data, null, 2),
      'utf-8'
    );
    console.log('parsedData.json saved!');
    return res.json(data);
  } catch (err) {
    console.error('❌ Failed to write to parsedData.json:', err);
  }
});
const formatFloor = (floor: any) => ({
  floorNumber: floor[0],
  queue: Array.isArray(floor[1])
    ? floor[1].map((car: [string, number]) => ({
      licensePlate: car[0],
      carsCount: car[1]
    }))
    : []
});
router.get('/', (req, res) => {
  let data: any[] = [];
  try {
    const file = fs.readFileSync(__dirname + '/parsedData.json', 'utf-8');
    data = JSON.parse(file);
  } catch (err) {
    return res.status(404).json({ error: "No data found" });
  }
  const responseData = data.map(formatFloor);
  wss.clients.forEach((client: import('ws').WebSocket) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'queueGet', data: responseData }));
    }
  });
  return res.json(responseData);
});
router.get('/:floorNumber', (req, res) => {
  let data: any[] = [];
  try {
    const file = fs.readFileSync(__dirname + '/parsedData.json', 'utf-8');
    data = JSON.parse(file);
  } catch (err) {
    return res.status(404).json({ error: "No data found" });
  }
  const floorNumber = Number(req.params.floorNumber);
  const floor = data.find((f: any) => f[0] === floorNumber);
  if (!floor) {
    return res.status(404).json({ error: "Floor not found" });
  }
  const responseData = formatFloor(floor);
  wss.clients.forEach((client: import('ws').WebSocket) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify({ type: 'queueGet', data: responseData }));
    }
  });
  return res.json(responseData);
});

export default router;