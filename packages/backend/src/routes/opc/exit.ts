import { wss } from '../../index'; 
console.log('exit.ts loaded!');
import { Router } from 'express';
import fs from 'fs';
import { number } from 'joi';
const router : Router = Router();


router.post('/Queue', (req, res) => {
  
  console.log('POST /Queue called');
  const data = req.body.value || [];
  // שמירה לקובץ בשם parsedData.json בתיקיית backend
fs.writeFileSync(
  __dirname + '/parsedData.json',
  JSON.stringify(data, null, 2),
  'utf-8'
);
console.log('parsedData.json saved!');
  return res.json(data);
});

router.get('/Queue/:floorNumber', (req, res) => {
  let data: any[] = [];
  try {
    const file = fs.readFileSync(__dirname + '/parsedData.json', 'utf-8');
    data = JSON.parse(file);
  } catch (err) {
    return res.status(404).json({ error: "No data found" });
  }

  // פונקציית עזר לסידור הפורמט
  const formatFloor = (floor: any) => ({
    floorNumber: floor[0],
    queue: Array.isArray(floor[1])
      ? floor[1].map((car: [string, number]) => ({
          licensePlate: car[0],
          carsCount: car[1]
        }))
      : []
  });

  const floorNumber = req.params.floorNumber ? Number(req.params.floorNumber) : undefined;

  let responseData;
  if (floorNumber !== undefined) {
    const floor = data.find((f: any) => f[0] === floorNumber);
    if (!floor) {
      return res.status(404).json({ error: "Floor not found" });
    }
    responseData = formatFloor(floor);
  } else {
    responseData = data.map(formatFloor);
  }

  // שליחת הנתונים לכל הלקוחות ב-WebSocket
  wss.clients.forEach((client: import('ws').WebSocket) => {
    if (client.readyState === 1) { // 1 = OPEN
      client.send(JSON.stringify({ type: 'queueGet', data: responseData }));
    }
  });

  return res.json(responseData);
});

router.post('/:param', (req, res) => {       
    res.json({  value: req.body.value });
});
export default router;