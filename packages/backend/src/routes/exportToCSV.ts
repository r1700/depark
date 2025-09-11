import express, { Request, Response } from "express";
import { Router } from 'express';
import { saveCSV } from '../utils/ExportToCSV'; 

const router : Router= Router();

router.post('/save-csv', (req, res) => {
   
    
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
     console.log("save-csv");
});


export default router; 
