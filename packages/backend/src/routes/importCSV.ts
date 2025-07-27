// ✅ routes/importCsv.ts - נתיב לטעינת CSV עם Multer ו-Sequelize
import express from 'express';
import multer from 'multer';
import fs from 'fs';
import csv from 'csv-parser';
import { AdminUser } from '../services/models/adminUser'; // Import AdminUser model
import sequelize from '../services/sequelizeInstance';
import { uploadGenericCsv } from '../services/importCSV'; // Import the upload function

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

// ✅ טעינה מ-CSV
router.post('/import-csv',uploadGenericCsv);
// router.post('/import-users',uploadGenericCsv);

// ✅ הצגת כל המשתמשים
router.get('/users', async (req, res) => {
    const allUsers = await AdminUser.findAll();
    res.json(allUsers);
});
export default router;
