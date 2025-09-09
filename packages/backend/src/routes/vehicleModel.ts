import express, { Request, Response, Router } from 'express';
import sequelize from '../config/sequelize'; 
import { QueryTypes } from 'sequelize';

const router: Router = express.Router();

interface ResolveBody {
vehicle_id?: number | string;
license_plate?: string;
make?: string;
model: string;
year_range?: { from?: number; to?: number; start?: number; end?: number } | null;
dimensions?: { height?: number | null; width?: number | null; length?: number | null; weight?: number | null } | null;
height?: number | null;
width?: number | null;
length?: number | null;
weight?: number | null;
source?: any;
created_at?: string | null;
updated_by?: string | null;
}

async function getColumnInfo(columnName: string) {
const q = `SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'vehiclemodels' AND column_name = $1 LIMIT 1` ;
const rows: any[] = await sequelize.query(q, {
type: QueryTypes.SELECT,
bind: [columnName],
});
return rows[0];
}

// GET /models
router.get('/models', async (req: Request, res: Response) => {
try {
const q =` SELECT id, make, model, year_range, dimensions FROM vehiclemodels ORDER BY COALESCE(make, '') ASC, COALESCE(model, '') ASC LIMIT 1000 `;
const rows: any[] = await sequelize.query(q, { type: QueryTypes.SELECT });
return res.json(rows);
} catch (err: any) {
console.error('DB error (models):', err && (err.stack || err.message || err));
return res.status(500).json({
error: 'Database error while fetching models',
message: err?.message ?? String(err),
});
}
});

/* GET unknown vehicles — root of this router */
router.get('/', async (req: Request, res: Response) => {
try {
const baseuserCheckRows: any[] = await sequelize.query("SELECT to_regclass('public.baseuser') AS name", { type: QueryTypes.SELECT });
const vehicleModelsCheckRows: any[] = await sequelize.query("SELECT to_regclass('public.vehiclemodels') AS name", { type: QueryTypes.SELECT });
const baseuserExists = !!(baseuserCheckRows[0] && baseuserCheckRows[0].name);
const vehicleModelsExists = !!(vehicleModelsCheckRows[0] && vehicleModelsCheckRows[0].name);


let fullNameExpr = "COALESCE(v.license_plate, '')";
if (baseuserExists) {
  const colsRes: any[] = await sequelize.query(
    `SELECT column_name FROM information_schema.columns WHERE table_name = 'baseuser' AND column_name = ANY($1)`,
    { type: QueryTypes.SELECT, bind: [['full_name', 'first_name', 'last_name']] }
  );
  const cols = (colsRes || []).map((r: any) => r.column_name);
  if (cols.includes('full_name')) {
    fullNameExpr = "COALESCE(NULLIF(TRIM(b.full_name), ''), v.license_plate, '')";
  } else if (cols.includes('first_name') && cols.includes('last_name')) {
    fullNameExpr = `COALESCE(NULLIF(TRIM(b.first_name || ' ' || b.last_name), ''), v.license_plate, '')`;
  } else if (cols.includes('first_name')) {
    fullNameExpr = `COALESCE(NULLIF(TRIM(b.first_name), ''), v.license_plate, '')`;
  } else {
    fullNameExpr = "COALESCE(v.license_plate, '')";
  }
}

let query = '';
if (vehicleModelsExists) {
  if (baseuserExists) {
    query = `
      SELECT
        v.id AS id,
        v.license_plate,
        ${fullNameExpr} AS full_name,
        COALESCE(vm.model, '-') AS model
      FROM vehicles v
      LEFT JOIN baseuser b ON b.id = v.baseuser_id
      LEFT JOIN vehiclemodels vm ON v.vehicle_model_id = vm.id
      WHERE v.vehicle_model_id IS NULL OR vm.model IS NULL
      ORDER BY v.id
      LIMIT 1000
    `;
  } else {
    query = `
      SELECT
        v.id AS id,
        v.license_plate,
        COALESCE(v.license_plate, '') AS full_name,
        COALESCE(vm.model, '-') AS model
      FROM vehicles v
      LEFT JOIN vehiclemodels vm ON v.vehicle_model_id = vm.id
      WHERE v.vehicle_model_id IS NULL OR vm.model IS NULL
      ORDER BY v.id
      LIMIT 1000
    `;
  }
} else {
  if (baseuserExists) {
    query = `
      SELECT
        v.id AS id,
        v.license_plate,
        ${fullNameExpr} AS full_name,
        '-' AS model
      FROM vehicles v
      LEFT JOIN baseuser b ON b.id = v.baseuser_id
      WHERE v.vehicle_model_id IS NULL
      ORDER BY v.id
      LIMIT 1000
    `;
  } else {
    query = `
      SELECT
        v.id AS id,
        v.license_plate,
        COALESCE(v.license_plate, '') AS full_name,
        '-' AS model
      FROM vehicles v
      WHERE v.vehicle_model_id IS NULL
      ORDER BY v.id
      LIMIT 1000
    `;
  }
}

const rows: any[] = await sequelize.query(query, { type: QueryTypes.SELECT });
return res.json(rows);
} catch (err: any) {
console.error('DB error (unknown-vehicles):', err && (err.stack || err.message || err));
return res.status(500).json({
error: 'Database error while fetching unknown vehicles',
message: err?.message ?? String(err),
});
}
});

/* GET vehicle by id */
router.get('/:id', async (req: Request, res: Response) => {
const id = Number(req.params.id);
if (!Number.isInteger(id)) return res.status(400).json({ error: 'invalid id' });
try {
const q = `SELECT v.*, vm.id AS vm_id, vm.make AS vm_make, vm.model AS vm_model, vm.year_range AS vm_year_range, vm.dimensions AS vm_dimensions, vm.source AS vm_source, vm.created_at AS vm_created_at FROM vehicles v LEFT JOIN vehiclemodels vm ON v.vehicle_model_id = vm.id WHERE v.id = $1 LIMIT 1` ;
const rows: any[] = await sequelize.query(q, { type: QueryTypes.SELECT, bind: [id] });
if (!rows || rows.length === 0) return res.status(404).json({ error: 'vehicle not found' });
return res.json(rows[0]);
} catch (err: any) {
console.error('GET vehicle error:', err && (err.stack || err.message || err));
return res.status(500).json({ error: 'DB error', message: err?.message ?? String(err) });
}
});

/* POST /resolve - create or update model and link to vehicle */
router.post('/resolve', async (req: Request<{}, {}, ResolveBody>, res: Response) => {
console.log('[POST /resolve] body:', JSON.stringify(req.body));
const {
vehicle_id,
license_plate,
make,
model,
year_range,
dimensions,
height = null,
width = null,
length = null,
weight = null,
source: providedSource = undefined,
created_at: providedCreatedAt = undefined,
updated_by: providedUpdatedBy = undefined,
} = req.body;

if (typeof make !== 'string' || make.trim().length === 0) {
return res.status(400).json({ error: 'make is required and must be a non-empty string' });
}
if (typeof model !== 'string' || model.trim().length === 0) {
return res.status(400).json({ error: 'model is required and must be a non-empty string' });
}

let vid: number | null = null;
let licensePlateLookup: string | null = null;

if (vehicle_id !== undefined && vehicle_id !== null && vehicle_id !== '') {
const n = Number(vehicle_id);
if (Number.isInteger(n) && n > 0) {
vid = n;
} else {
return res.status(400).json({ error: 'vehicle_id must be a positive integer' });
}
} else if (license_plate) {
licensePlateLookup = String(license_plate);
} else {
return res.status(400).json({ error: 'vehicle_id (numeric) or license_plate must be provided' });
}

let fromVal: number | undefined;
let toVal: number | undefined;
let yearRangeNormalized: { from: number; to: number } | null = null;

if (year_range != null && typeof year_range === 'object') {
const rawFrom = (year_range as any).from ?? (year_range as any).start;
const rawTo = (year_range as any).to ?? (year_range as any).end;
const maybeFrom = rawFrom != null ? Number(rawFrom) : undefined;
const maybeTo = rawTo != null ? Number(rawTo) : undefined;
if (maybeFrom !== undefined && !Number.isNaN(maybeFrom)) fromVal = Math.trunc(maybeFrom);
if (maybeTo !== undefined && !Number.isNaN(maybeTo)) toVal = Math.trunc(maybeTo);
if (fromVal == null || toVal == null) {
return res.status(400).json({ error: 'year_range must include integer from and to' });
}
if (!Number.isInteger(fromVal) || !Number.isInteger(toVal) || fromVal > toVal) {
return res.status(400).json({ error: 'year_range must have integer from and to with from <= to' });
}
yearRangeNormalized = { from: fromVal, to: toVal };
} else {
yearRangeNormalized = null;
}

const dimsObj = dimensions && typeof dimensions === 'object'
? {
height: dimensions.height == null ? null : Number(dimensions.height),
width: dimensions.width == null ? null : Number(dimensions.width),
length: dimensions.length == null ? null : Number(dimensions.length),
weight: dimensions.weight == null ? null : Number(dimensions.weight),
}
: {
height: height == null ? null : Number(height),
width: width == null ? null : Number(width),
length: length == null ? null : Number(length),
weight: weight == null ? null : Number(weight),
};

let transaction: any = null;
try {
const colInfo = await getColumnInfo('source');
let sourceValue: any = null;
if (!colInfo) {
sourceValue = null;
} else {
const dataType = String(colInfo.data_type).toLowerCase();
const isNullable = colInfo.is_nullable === 'YES';
const numericTypes = ['int', 'integer', 'bigint', 'smallint', 'numeric', 'real', 'double precision'];
const isNumeric = numericTypes.some((t) => dataType.includes(t));
if (isNumeric) {
if (providedSource !== undefined && providedSource !== null) {
const p = Number(providedSource);
if (!Number.isNaN(p) && Number.isInteger(p)) sourceValue = p;
else return res.status(400).json({ error: 'source must be integer' });
} else {
const envDefault = process.env.DEFAULT_SOURCE_ID;
if (envDefault !== undefined) {
const parsedEnv = Number(envDefault);
if (!Number.isNaN(parsedEnv) && Number.isInteger(parsedEnv)) sourceValue = parsedEnv;
else return res.status(500).json({ error: 'DEFAULT_SOURCE_ID invalid' });
} else if (isNullable) {
sourceValue = null;
} else {
return res.status(400).json({ error: 'source required or set DEFAULT_SOURCE_ID' });
}
}
} else {
sourceValue = providedSource != null ? (typeof providedSource === 'object' ? JSON.stringify(providedSource) : String(providedSource)) : 'manual_override';
}
}


transaction = await sequelize.transaction();

// lock vehicle row
let vRows: any[];
if (vid !== null) {
  vRows = await sequelize.query('SELECT * FROM vehicles WHERE id = $1 FOR UPDATE', {
    type: QueryTypes.SELECT,
    transaction,
    bind: [vid],
  });
} else {
  vRows = await sequelize.query('SELECT * FROM vehicles WHERE license_plate = $1 FOR UPDATE', {
    type: QueryTypes.SELECT,
    transaction,
    bind: [licensePlateLookup],
  });
}

if (!vRows || vRows.length === 0) {
  await transaction.rollback().catch(() => {});
  return res.status(404).json({ error: 'vehicle not found' });
}
const vehicleRow = vRows[0];
const vehicleRowId = vehicleRow.id;
const existingVehicleModelId = vehicleRow.vehicle_model_id ?? null;

if (existingVehicleModelId) {
  const sets: string[] = [];
  const params: any[] = [];
  let idx = 1;

  if (make !== undefined) { sets.push(`make = $${idx++}`); params.push(make); }
      if (model !== undefined) { sets.push(`model = $${idx++}`); params.push(model); }
  if (year_range !== undefined) {
    if (yearRangeNormalized) {
      sets.push(`year_range = $${idx++}::jsonb`);
          params.push(JSON.stringify(yearRangeNormalized));
        } else {
          sets.push(`year_range = NULL`);
        }
      }
      if (dimensions !== undefined || height !== undefined || width !== undefined || length !== undefined || weight !== undefined) {
        sets.push(`dimensions = $${idx++}::jsonb`);
    params.push(JSON.stringify(dimsObj));
  }
  if (providedSource !== undefined) {
    sets.push(`source = $${idx++}`);
        params.push(sourceValue);
      }
      if (providedCreatedAt !== undefined) {
        const createdAtIso = providedCreatedAt ? (() => { const d = new Date(providedCreatedAt); return Number.isNaN(d.getTime()) ? null : d.toISOString(); })() : null;
        sets.push(`created_at = $${idx++}`);
    params.push(createdAtIso);
  }
  sets.push(`updated_at = now()`);
  if (providedUpdatedBy !== undefined) {
    sets.push(`updated_by = $${idx++}`);
        params.push(providedUpdatedBy ?? null);
      }

      if (sets.length > 0) {
        const updateSql = `UPDATE vehiclemodels SET ${sets.join(', ')} WHERE id = $${idx} RETURNING *`;
    params.push(existingVehicleModelId);
    const updRows: any[] = await sequelize.query(updateSql, { type: QueryTypes.SELECT, transaction, bind: params });
    await transaction.commit();
    return res.status(200).json({
      ok: true,
      message: 'Model updated and vehicle remains linked',
      vehicle_model: updRows[0],
      vehicle_id: vehicleRowId,
    });
  } else {
    await transaction.commit();
    return res.status(200).json({
      ok: true,
      message: 'No changes provided; vehicle remains linked to existing model',
      vehicle_model_id: existingVehicleModelId,
      vehicle_id: vehicleRowId,
    });
  }
}

let vehicleModelId: number;
let usedExisting = false;

if (yearRangeNormalized === null) {
  const existingQNull = `
    SELECT id FROM vehiclemodels
    WHERE make = $1 AND model = $2 AND year_range IS NULL
    LIMIT 1
  `;
  const existingResNull: any[] = await sequelize.query(existingQNull, { type: QueryTypes.SELECT, transaction, bind: [make, model] });
  if (existingResNull && existingResNull.length > 0) {
    vehicleModelId = existingResNull[0].id;
    usedExisting = true;
  } else {
    const insertSqlNull = `
      INSERT INTO vehiclemodels
        (make, model, year_range, dimensions, source, created_at, updated_at, updated_by)
      VALUES
        ($1, $2, NULL, $3::jsonb, $4, COALESCE($5, now()), now(), $6)
      RETURNING id, *
    `;
    const createdAtIso = providedCreatedAt ? (() => {
      const d = new Date(providedCreatedAt);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    })() : null;
    const insertParamsNull = [
      make,
      model,
      JSON.stringify(dimsObj),
      sourceValue,
      createdAtIso,
      providedUpdatedBy ?? null,
    ];
    const insResNull: any[] = await sequelize.query(insertSqlNull, { type: QueryTypes.SELECT, transaction, bind: insertParamsNull });
    vehicleModelId = insResNull[0].id;
    usedExisting = false;
  }
} else {
  const existingQ = `
    SELECT id FROM vehiclemodels
    WHERE make = $1 AND model = $2 AND year_range = $3::jsonb
    LIMIT 1
  `;
  const existingRes: any[] = await sequelize.query(existingQ, { type: QueryTypes.SELECT, transaction, bind: [make, model, JSON.stringify(yearRangeNormalized)] });
  if (existingRes && existingRes.length > 0) {
    vehicleModelId = existingRes[0].id;
    usedExisting = true;
  } else {
    const insertSql = `
      INSERT INTO vehiclemodels
        (make, model, year_range, dimensions, source, created_at, updated_at, updated_by)
      VALUES
        ($1, $2, $3::jsonb, $4::jsonb, $5, COALESCE($6, now()), now(), $7)
      RETURNING id, *
    `;
    const createdAtIso = providedCreatedAt ? (() => {
      const d = new Date(providedCreatedAt);
      return Number.isNaN(d.getTime()) ? null : d.toISOString();
    })() : null;
    const insertParams = [
      make,
      model,
      JSON.stringify(yearRangeNormalized),
      JSON.stringify(dimsObj),
      sourceValue,
      createdAtIso,
      providedUpdatedBy ?? null,
    ];
    const insRes: any[] = await sequelize.query(insertSql, { type: QueryTypes.SELECT, transaction, bind: insertParams });
    vehicleModelId = insRes[0].id;
    usedExisting = false;
  }
}

const updateVehicleSql = `UPDATE vehicles SET vehicle_model_id = $1 WHERE id = $2 RETURNING *`;
const updateVehicleRes: any[] = await sequelize.query(updateVehicleSql, { type: QueryTypes.SELECT, transaction, bind: [vehicleModelId, vehicleRowId] });

await transaction.commit();

return res.status(200).json({
  ok: true,
  message: usedExisting ? 'Used existing model and linked to vehicle' : 'Model created and linked to vehicle',
  vehicle_model_id: vehicleModelId,
  vehicle: updateVehicleRes[0],
});
} catch (err: any) {
if (transaction) {
try { await transaction.rollback(); } catch (e) {}
}
console.error('Resolve error:', err && (err.stack || err.message || err));
return res.status(500).json({ error: err?.message || 'Error resolving vehicle' });
}
});

export default router;