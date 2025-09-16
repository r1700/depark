import { Request, Response } from 'express';
import { DimensionsSource } from '../enums/vehicle';
import { api } from '../routes/vehicleRoute';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';
import { Axios } from 'axios';

async function fetchSizes(api: Axios, body: any) {
    try {
        const resp = await api.get('/api/vehicle/get-vehicle', {
            params: { degem: body.vehicleModelId }
        })
        if (resp.data.gova === 'no data available')
            body.height = null
        else
            body.height = resp.data.gova;
        body.weight = resp.data.mishkal_kolel;
        //it returns just height and weight
        // body.length = resp.data.mishkal_kolel;
        // body.width = resp.data.mishkal_kolel;
        return body
    } catch (err: any) {
        console.error('HTTP error calling get-vehicle', err?.response?.data ?? err.message);
        throw err;
    }
}


const dimensionsSourceMapping: { [key: string]: DimensionsSource } = {
    model_reference: DimensionsSource.ModelReference,
    manual_override: DimensionsSource.ManualOverride,
    government_db: DimensionsSource.GovernmentDb,
};

function mapDimensionsSource(dimensionsSource: string): DimensionsSource {
    return dimensionsSourceMapping[dimensionsSource] || DimensionsSource.GovernmentDb;
}


export const updateVehicle = async (req: Request, res: Response) => {
    try {
        const id = Number(req.params.id ?? req.body.id);
        if (!id) return res.status(400).json({ success: false, message: 'Missing vehicle id' });
        let body = { ...req.body };
        if (body.dimensionsSource === 'government_db') {
            // body.width = 7; body.height = 3; body.length = 10; body.weight = 1000;          
                body = await fetchSizes(api, body);
        }

        const replacements: any = { id };
        const sets: string[] = [];

        const setIf = (key: string, col: string, transform?: (v: any) => any) => {
            if (body[key] !== undefined) {
                replacements[col] = transform ? transform(body[key]) : body[key];
                sets.push(`"${col}" = :${col}`);
            }
        };

        setIf('licensePlate', 'license_plate');
        setIf('user', 'baseuser_id', v => Number(v));
        setIf('isActive', 'is_active', v => !!v);
        setIf('isCurrentlyParked', 'is_currently_parked', v => !!v);
        setIf('addedBy', 'added_by');
        setIf('color', 'color');
        setIf('vehicleModelId', 'vehicle_model_id', v => v ?? null);
        if (
            body.width !== undefined || body.height !== undefined ||
            body.length !== undefined || body.weight !== undefined
        ) {
            const dim = { width: body.width ?? null, height: body.height ?? null, length: body.length ?? null, weight: body.weight ?? null };
            replacements.dimension_overrides = JSON.stringify(dim);
            sets.push(`"dimension_overrides" = :dimension_overrides::jsonb`);
        } else if (body.dimensionOverrides !== undefined) {
            replacements.dimension_overrides = typeof body.dimensionOverrides === 'string' ? body.dimensionOverrides : JSON.stringify(body.dimensionOverrides);
            sets.push(`"dimension_overrides" = :dimension_overrides::jsonb`);
        }

        if (body.dimensionsSource !== undefined) {
            replacements.dimensions_source = mapDimensionsSource(body.dimensionsSource);
            sets.push(`"dimensions_source" = :dimensions_source`);
        }

        if (sets.length === 0) return res.status(400).json({ success: false, message: 'No fields to update' });

        sets.push(`"updated_at" = NOW()`);

        const sql = `UPDATE "vehicles" SET ${sets.join(', ')} WHERE id = :id RETURNING *;`;

        const result = await sequelize.query(sql, { replacements, type: QueryTypes.UPDATE });
        const rows = (result as any[])[0] as any[];
        const updated = Array.isArray(rows) && rows.length ? rows[0] : rows;

        if (!updated) return res.status(404).json({ success: false, message: 'Vehicle not found' });
        return res.status(200).json({ success: true, vehicle: updated });
    } catch (err: any) {
        console.error('updateVehicle error', err);
        if (err?.original?.constraint || err?.name === 'SequelizeUniqueConstraintError') {
            const detail = err?.original?.detail || err?.errors?.[0]?.message || 'Duplicate key';
            return res.status(400).json({ success: false, message: String(detail) });
        }
        return res.status(500).json({ success: false, message: err?.message || 'DB error' });
    }
};



export const addVehicle = async (req: Request, res: Response) => {
    try {
        let body = { ...req.body };
        if (body.dimensionsSource === 'government_db') {          
                body = await fetchSizes(api, body);
        }

        const baseuserId = body.user !== undefined ? parseInt(body.user, 10) : null;
        const { licensePlate, width, height, length, weight, dimensionsSource, vehicleModelId } = body;

        const dimensionOverrides =
            width || height || length || weight
                ? { width: width ?? null, height: height ?? null, length: length ?? null, weight: weight ?? null }
                : null;

        const sql = `
      INSERT INTO "vehicles"
        ("license_plate", "baseuser_id", "is_active", "is_currently_parked", "added_by", "dimension_overrides", "dimensions_source", "vehicle_model_id", "created_at", "updated_at")
      VALUES
        (:license_plate, :baseuser_id, :is_active, :is_currently_parked, :added_by, :dimension_overrides::jsonb, :dimensions_source, :vehicle_model_id, NOW(), NOW())
      RETURNING *;
    `;

        const replacements = {
            license_plate: licensePlate,
            baseuser_id: baseuserId,
            is_active: true,
            is_currently_parked: false,
            added_by: 2,
            dimension_overrides: dimensionOverrides ? JSON.stringify(dimensionOverrides) : null,
            dimensions_source: mapDimensionsSource(dimensionsSource),
            vehicle_model_id: vehicleModelId,
        };

        const [rows] = await sequelize.query(sql, {
            replacements,
            type: QueryTypes.INSERT,
        });

        const inserted = Array.isArray(rows) && rows.length ? rows[0] : rows;
        return res.status(201).json({ success: true, vehicle: inserted });
    } catch (err: any) {
        console.error('Error adding vehicle', err);
        if (err?.original?.constraint || err?.name === 'SequelizeUniqueConstraintError') {
            const detail = err?.original?.detail || err?.errors?.[0]?.message || 'Duplicate key';
            return res.status(400).json({ success: false, message: String(detail) });
        }
        return res.status(500).json({ success: false, message: err?.message || 'DB error' });
    }
};
