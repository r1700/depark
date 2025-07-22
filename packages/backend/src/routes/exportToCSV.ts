import express, { Request, Response } from "express";
import { Router } from 'express';
import { saveCSV } from '../services/exportToCSV'; // ייבוא הפונקציה מהקובץ השני

// const app = express();
const router = Router();
const port: number = 3001;

// app.use(express.json());

router.post('/save-csv', (req: Request, res: Response) => {
    console.log("save-csv");
    
    const { jsonData, filename } = req.body;
    if (!jsonData || !filename) {
        return res.status(400).send('jsonData and filename are required');
    }
    try {
        saveCSV(jsonData, filename);
        res.status(200).send('CSV saved successfully');
    } catch (error) {
        if (error instanceof Error) {
            res.status(500).send('Error saving CSV: ' + error.message);
        } else {
            res.status(500).send('Error saving CSV: Unknown error');
        }
    }
});

// app.use(router);

// app.listen(port, () => {
//     console.log(`Server running at http://localhost:${port}`);
// });

export default router;
