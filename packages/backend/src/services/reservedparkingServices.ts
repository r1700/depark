// Flexible date parsing

import { literal } from 'sequelize';
import sequelize from '../config/sequelize';
// import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';


export async function getAllReservedParking() {
    const results = await sequelize.query(
        `
       SELECT
    id,
    baseuser_id,
    parking_number,
    day_of_week,
    \"createdAt\",
    \"updatedAt\"
FROM reservedparking
        `,
        { type: QueryTypes.SELECT }
    );
    return results;
}



export async function addReservedParking(reservedparking: {
    baseuser_id: number;
    parking_number: number;
    day_of_week: string;
}) {
    const results = await sequelize.query(
        `
        INSERT INTO reservedparking (baseuser_id, parking_number, day_of_week)
        VALUES (:baseuser_id, :parking_number, :day_of_week)
        RETURNING *;
        `,
        {
            replacements: {
                baseuser_id: reservedparking.baseuser_id,
                parking_number: reservedparking.parking_number,
                day_of_week: reservedparking.day_of_week
            },
            type: QueryTypes.INSERT
        }
    );
    return results;
}

export async function updateReservedParking(id: number, reservedparking: {
    baseuser_id: number;
    parking_number: number;
    day_of_week: string;
}) {
    const results = await sequelize.query(
        `
        UPDATE reservedparking
        SET baseuser_id = :baseuser_id,
            parking_number = :parking_number,
            day_of_week = :day_of_week,
            "updatedAt" = :updatedAt
        WHERE id = :id
        RETURNING *;
        `,
        {
            replacements: {
                id,
                baseuser_id: reservedparking.baseuser_id,
                parking_number: reservedparking.parking_number,
                day_of_week: reservedparking.day_of_week,
                updatedAt: new Date()
            },
            type: QueryTypes.UPDATE
        }
    );
    return results;
}

export async function deleteReservedParking(id: number) {
  const results = await sequelize.query(
    `
      DELETE FROM reservedparking
      WHERE id = :id
      RETURNING *;
    `,
    {
      replacements: { id },
      type: QueryTypes.DELETE
    }
  );
  return results;
}



function parseFlexibleDate(dateStr: string): Date {
    dateStr = dateStr.replace(/^"+|"+$/g, '').trim();
    let match = dateStr.match(/^(\d{2})[\/-](\d{2})[\/-](\d{4})$/);
    if (match) {
        const [, day, month, year] = match;
        return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
    match = dateStr.match(/^(\d{2})[\/-](\d{2})[\/-](\d{2})$/);
    if (match) {
        const [, day, month, shortYear] = match;
        let year = parseInt(shortYear, 10);
        year = year < 50 ? 2000 + year : 1900 + year;
        return new Date(`${year}-${month}-${day}T00:00:00Z`);
    }
    const parsed = new Date(dateStr);
    if (!isNaN(parsed.getTime())) {
        return parsed;
    }
    throw new Error(`Invalid date format: ${dateStr}`);
}

function formatDateForSQL(date: Date): string {
    return date.toISOString().split('T')[0];
}

type ReservedParkingSearchInput = {
    parking_number?: string | string[];
    day_of_week?: string | string[];
    createdAt?: string;
    updatedAt?: string;
    freeSearch?: string;
    [key: string]: any;
};

function buildWhereClauseFromReservedParkingInput(input: ReservedParkingSearchInput): string {
    const conditions: string[] = [];
    // parking_number: comma-separated list or single value
    if (input.parking_number) {
        if (Array.isArray(input.parking_number)) {
            const nums = input.parking_number.map(num => `'${num}'`).join(', ');
            conditions.push(`parking_number IN (${nums})`);
        } else if (typeof input.parking_number === 'string' && input.parking_number.includes(',')) {
            const nums = input.parking_number.split(',').map(num => `'${num.trim()}'`).join(', ');
            conditions.push(`parking_number IN (${nums})`);
        } else {
            conditions.push(`parking_number ILIKE '%${input.parking_number}%'`);
        }
    }
    // day_of_week: comma-separated list or single value
    if (input.day_of_week) {
        if (Array.isArray(input.day_of_week)) {
            const days = input.day_of_week.map(day => `'${day}'`).join(', ');
            conditions.push(`day_of_week IN (${days})`);
        } else if (typeof input.day_of_week === 'string' && input.day_of_week.includes(',')) {
            const days = input.day_of_week.split(',').map(day => `'${day.trim()}'`).join(', ');
            conditions.push(`day_of_week IN (${days})`);
        } else {
            conditions.push(`day_of_week ILIKE '%${input.day_of_week}%'`);
        }
    }
    // freeSearch: search in parking_number and day_of_week
    if (input.freeSearch) {
        const safe = input.freeSearch.replace(/'/g, "''");
        const likePattern = `%${safe}%`;
        conditions.push(
            `(parking_number ILIKE '${likePattern}' OR day_of_week ILIKE '${likePattern}')`
        );
    }
    // createdAt >= date
    if (input.createdAt) {
        try {
            const parsedDate = parseFlexibleDate(input.createdAt as string);
            const startStr = formatDateForSQL(parsedDate);
            conditions.push(`"createdAt" >= '${startStr}'`);
        } catch {
            throw new Error(`Invalid date format in createdAt`);
        }
    }
    // updatedAt >= date
    if (input.updatedAt) {
        try {
            const parsedDate = parseFlexibleDate(input.updatedAt as string);
            const startStr = formatDateForSQL(parsedDate);
            conditions.push(`"updatedAt" >= '${startStr}'`);
        } catch {
            throw new Error(`Invalid date format in updatedAt`);
        }
    }
    return conditions.length > 0 ? conditions.join(' AND ') : '1=1';
}

function convertQueryToReservedParkingInput(query: any): ReservedParkingSearchInput {
    const input: ReservedParkingSearchInput = {};
    if (query.parking_number) {
        if (Array.isArray(query.parking_number)) {
            input.parking_number = query.parking_number.filter((num: string) => typeof num === 'string');
        } else if (typeof query.parking_number === 'string') {
            if (query.parking_number.includes(',')) {
                input.parking_number = query.parking_number.split(',').map((num: string) => num.trim());
            } else {
                input.parking_number = query.parking_number;
            }
        }
    }
    if (query.day_of_week) {
        if (Array.isArray(query.day_of_week)) {
            input.day_of_week = query.day_of_week.filter((day: string) => typeof day === 'string');
        } else if (typeof query.day_of_week === 'string') {
            if (query.day_of_week.includes(',')) {
                input.day_of_week = query.day_of_week.split(',').map((day: string) => day.trim());
            } else {
                input.day_of_week = query.day_of_week;
            }
        }
    }
    if (query.freeSearch) input.freeSearch = query.freeSearch as string;
    if (query.createdAt) {
        const parsedDate = parseFlexibleDate(query.createdAt as string);
        if (parsedDate) {
            input.createdAt = parsedDate.toISOString().split('T')[0];
        }
    }
    if (query.updatedAt) {
        const parsedDate = parseFlexibleDate(query.updatedAt as string);
        if (parsedDate) {
            input.updatedAt = parsedDate.toISOString().split('T')[0];
        }
    }
    return input;
}

// Handler for filtered reserved parking search
export async function handleReservedParkingFilter(req: any, res: any) {
    try {
        const input: ReservedParkingSearchInput = convertQueryToReservedParkingInput(req.query);
        const whereClause = buildWhereClauseFromReservedParkingInput(input);
        const results = await sequelize.query(
            `SELECT * FROM reservedparking WHERE ${whereClause}`,
            { type: QueryTypes.SELECT }
        );
        res.json({
            whereClause,
            results
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}






