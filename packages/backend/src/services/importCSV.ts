import { Request, Response } from 'express';
import fs from 'fs';
import csv from 'csv-parser';
import sequelize from './sequelizeInstance';
import multer from 'multer';

import { AdminUser } from './models/adminUser'; // Import AdminUser model
import { BaseUser } from './models/baseUser'; // Import BaseUser model

const upload = multer({ dest: 'uploads/' });

type ModelMap = {
    [key: string]: any; // mapping between model name and Sequelize model
};
const modelMap: ModelMap = {
    adminuser: AdminUser,
    baseuser: BaseUser,
};

export const uploadGenericCsv = [
    upload.single('file'),
    async (req: Request, res: Response) => {
        console.log("modelName", req.query.model);

        const modelName = req.query.model?.toString().toLowerCase();
        console.log("modelName", modelName);
        console.log("[[[[[", modelMap);
        console.log('Model map keys:', Object.keys(modelMap));


        if (!modelName || !modelMap[modelName]) {

            return res.status(400).json({ error: '❌ שם מודל חסר או לא חוקי' });
        }

        if (!req.file) return res.status(400).send('❌ לא הועלה קובץ');
        const filePath = req.file.path;
        const Model = modelMap[modelName];
        console.log("model ", Model);

        try {
            const entries: any[] = [];

            await new Promise<void>((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        if (row.permissions) {
                            try {
                                row.permissions = JSON.parse(row.permissions);
                            } catch {
                                row.permissions = [];
                            }
                        }
                        if (row.lastLoginAt) {
                            row.lastLoginAt = new Date(row.lastLoginAt);
                        }
                        if (row.lastLoginAt) {
                            const parsed = new Date(row.lastLoginAt);
                            row.lastLoginAt = isNaN(parsed.getTime()) ? null : parsed;
                        }

                        entries.push(row);
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            await sequelize.authenticate();
            await Model.bulkCreate(entries, { ignoreDuplicates: true });

            res.json({ message: `✅ ${modelName} נוספו בהצלחה`, count: entries.length });

        }

        catch (err) {
            if (!Model) {
                return res.status(500).json({ error: '❌ המודל לא נמצא ב־modelMap' });
            }
            console.error(err);
            res.status(500).json({ error: '❌ שגיאה בהעלאת נתונים', details: err });
        } finally {
            fs.unlinkSync(filePath);
        }
    }
];
