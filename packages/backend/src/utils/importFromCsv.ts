
import type { Request, Response, RequestHandler } from 'express';
import fs from 'fs';
import path from 'path';
import csv from 'csv-parser';
import sequelize from '../config/sequelize';
import multer from 'multer';

// Normalization function
function normalizeFieldName(fieldName: string) {
    return fieldName
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^\w_]+/g, '');
}
// Loading models
export function loadModels() {
    // dist: __dirname -> .../packages/backend/dist/src/utils (למשל)
    const distModelsDir = path.resolve(__dirname, "..", "model", "database-models");
    const srcModelsDir  = path.resolve(process.cwd(), "src", "model", "database-models");
    const baseDir = fs.existsSync(distModelsDir) ? distModelsDir : srcModelsDir;

    const allowTs = baseDir === srcModelsDir; // ב-dev אפשר .ts
    for (const file of fs.readdirSync(baseDir)) {
        if (file.startsWith("_")) continue;
        const ext = path.extname(file).toLowerCase();
        if (ext !== ".js" && !(allowTs && ext === ".ts")) continue;

        const full = path.join(baseDir, file);
        require(full);
    }

    // console.log('📦 Models loaded:', Object.keys(sequelize.models)); // אל תדפיסי סודות
}
loadModels();
const upload = multer({ dest: 'uploads/' });
/**
* Input with support for inheritance relationships (belongsTo)
*/
async function insertWithInheritance(modelName: string, row: any) {
    const Model = sequelize.models[modelName];
    if (!Model) throw new Error(`Model ${modelName} not found`);
    // Find the parent model
    const parentAssoc = Object.values(Model.associations).find(
        assoc => assoc.associationType === "BelongsTo"
    );
    if (!parentAssoc) {
        return Model.create(row);
    }
    const parentModel = parentAssoc.target;
    const parentFields = Object.keys(parentModel.rawAttributes);
    const baseData: any = {};
    const childData: any = {};
    for (const [key, value] of Object.entries(row)) {
        if (parentFields.includes(key)) {
            baseData[key] = value;
        } else {
            childData[key] = value;
        }
    }
    const parentInstance = await parentModel.create(baseData);
    let foreignKey: string;
    if (typeof (parentAssoc as any).foreignKey === "string") {
        foreignKey = (parentAssoc as any).foreignKey;
    } else if ((parentAssoc as any).foreignKey?.name) {
        foreignKey = (parentAssoc as any).foreignKey.name;
    } else {
        throw new Error(`לא נמצא foreignKey בקשר של ${modelName}`);
    }
    childData[foreignKey] = parentInstance.getDataValue("id");
    return Model.create(childData);
}
export const uploadGenericCsv:  RequestHandler[] = [
    upload.single('file'),
    async (req: Request, res: Response) => {
        console.log("📌 Models loaded:", Object.keys(sequelize.models));
        if (!req.file) {
            return res.status(400).json({ error: "❌ No file uploaded" });
        }
        const filePath = req.file.path;
        try {
            const entriesByModel: Record<string, any[]> = {};
            await new Promise<void>((resolve, reject) => {
                fs.createReadStream(filePath)
                    .pipe(csv())
                    .on('data', (row) => {
                        let matchedAnyModel = false;
                        // Builds a map of normalized fields → original fields from the CSV
                        const rowNormalizedMap: Record<string, string> = {};
                        for (const key of Object.keys(row)) {
                            rowNormalizedMap[normalizeFieldName(key)] = key;
                        }
                        for (const [modelName, Model] of Object.entries(sequelize.models)) {

                            let modelFields = Object.keys(Model.rawAttributes);
                            const parentAssoc = Object.values(Model.associations).find(
                                assoc => assoc.associationType === 'BelongsTo'
                            );
                            if (parentAssoc) {
                                const parentModel = parentAssoc.target;
                                modelFields = [...new Set([...modelFields, ...Object.keys(parentModel.rawAttributes)])];
                            }

                            const normalizedModelFields = modelFields.map(normalizeFieldName);
                            // Required fields in the model
                            const requiredFields = Object.entries(Model.rawAttributes)
                                .filter(([_, attr]: any) => attr.allowNull === false)
                                .map(([field]) => normalizeFieldName(field));

                            const filteredRow: any = {};
                            // Build a filtered record from a row
                            for (let i = 0; i < modelFields.length; i++) {
                                const modelField = modelFields[i];

                                const normalizedModelField = normalizedModelFields[i];

                                if (rowNormalizedMap[normalizedModelField]) {
                                    const originalKey = rowNormalizedMap[normalizedModelField];
                                    filteredRow[modelField] = row[originalKey];
                                }
                            }
                            delete filteredRow.id;

                            if (filteredRow.permissions && typeof filteredRow.permissions === 'string') {
                                try {
                                    filteredRow.permissions = JSON.parse(filteredRow.permissions.replace(/'/g, '"'));
                                } catch {
                                    filteredRow.permissions = [];
                                }
                            }
                            if (filteredRow.role) {
                                filteredRow.role = Number(filteredRow.role);
                            }
                            // Check for required fields
                            const hasAllRequired = requiredFields.every(field =>
                                filteredRow[modelFields[normalizedModelFields.indexOf(field)]] !== undefined &&
                                filteredRow[modelFields[normalizedModelFields.indexOf(field)]] !== null &&
                                filteredRow[modelFields[normalizedModelFields.indexOf(field)]] !== ''
                            );

                            if (hasAllRequired) {
                                if (!entriesByModel[modelName]) entriesByModel[modelName] = [];
                                entriesByModel[modelName].push(filteredRow);
                                matchedAnyModel = true;
                            }
                        }

                        if (!matchedAnyModel) {
                            console.warn(`⚠️ Row does not match any model:`, row);
                        }
                    })
                    .on('end', resolve)
                    .on('error', reject);
            });

            if (Object.keys(entriesByModel).length === 0) {
                return res.status(400).json({
                    error: "❌ No data found matching any model",
                    modelsAvailable: Object.keys(sequelize.models),
                    hint: "Check if the column names in the CSV match the model fields"
                });
            }
            // Inserting data into each model
            for (const [modelName, entries] of Object.entries(entriesByModel)) {
                const Model = sequelize.models[modelName];
                const hasParent = Object.values(Model.associations).some(
                    assoc => assoc.associationType === 'BelongsTo'
                );
              const modelFields = Object.keys(Model.rawAttributes).filter(f => f !== 'id');
                console.log({hasParent})
                if (hasParent) {
                    for (const row of entries) {
                        await insertWithInheritance(modelName, row);
                    }
                } else {
                    await Model.bulkCreate(entries, { ignoreDuplicates: true , fields: modelFields });
                }
            }
            res.json({
                message: "✅ Data uploaded successfully",
                counts: Object.fromEntries(Object.entries(entriesByModel).map(([k, v]) => [k, v.length]))
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "❌ Error uploading data", details: err });
        } finally {
            fs.unlinkSync(filePath);
        }
    }
];
