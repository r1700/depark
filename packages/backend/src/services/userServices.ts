import { literal } from 'sequelize';
import sequelize from '../config/sequelize';
import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';
// import { Op } from 'sequelize';

function buildLiteral(tableName: string, whereClause: string) {
    const query = `(
    SELECT *
    FROM ${tableName} 
    WHERE ${whereClause}
  )`;
    return literal(query);
}

type SearchInput = {
    department?: string | string[];
    email?: string;
    phone?: string;
    employee_id?: string;
    max_cars_allowed_parking?: number;
    freeSearch?: string;
    [key: string]: any;
};

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


function getDateRange(dateStr: string): [Date, Date] {
    const startDate = new Date(dateStr);

    const today = new Date();


    startDate.setHours(0, 0, 0, 0);
    today.setHours(23, 59, 59, 999);

    return [startDate, today];
}




function buildWhereClauseFromInput(input: SearchInput, getDateRange: (dateStr: string) => [Date, Date]): string {
    const conditions: string[] = [];

    if (input.department) {
        if (Array.isArray(input.department)) {
            const deps = input.department.map(dep => `'${dep}'`).join(', ');
            conditions.push(`department IN (${deps})`);
        } else {
            conditions.push(`department ILIKE '%${input.department}%'`);
        }
    }

    if (input.freeSearch) {
        const safe = input.freeSearch.replace(/'/g, "''");
        const likePattern = `%${safe}%`;
        conditions.push(
            `(first_name ILIKE '${likePattern}' OR last_name ILIKE '${likePattern}'` +
            ` OR phone ILIKE '${likePattern}' OR email ILIKE '${likePattern}')`
        );
    }
   
    // חיפושים מדויקים
    if (input.status !== undefined) conditions.push(`status = ${input.status}`);
    if (input.max_cars_allowed_parking !== undefined) conditions.push(`max_cars_allowed_parking >= ${input.max_cars_allowed_parking}`);
   

    // תאריכים
    const dateFields: (keyof SearchInput)[] = ['created_at', 'updated_at', 'approved_at'];
    for (const field of dateFields) {
        if (input[field]) {
            try {
                const parsedDate = parseFlexibleDate(input[field] as string);
                const [start, end] = getDateRange(formatDateForSQL(parsedDate));
                const startStr = formatDateForSQL(start);
                const endStr = formatDateForSQL(end);
                conditions.push(`${field} BETWEEN '${startStr}' AND '${endStr}'`);
            } catch {
                throw new Error(`Invalid date format in ${field}`);
            }
        }
    }

    return conditions.length > 0 ? conditions.join(' AND ') : '1=1';
}

function convertQueryToSearchInput(req: Request): SearchInput {
    const query = req.query;
    const input: SearchInput = {};

    if (query.department) {
        if (Array.isArray(query.department)) {
            input.department = query.department.filter(dep => typeof dep === 'string');
        } else if (typeof query.department === 'string') {
            
            if (query.department.includes(',')) {
                input.department = query.department.split(',').map(dep => dep.trim());
            } else {
                input.department = query.department;
            }
        }
    }

    if (query.freeSearch) input.freeSearch = query.freeSearch as string;
    if (query.phone) input.phone = query.phone as string;
    if (query.email) input.email = query.email as string;
   
    if (query.status) input.status = Number(query.status);
    if (query.max_cars_allowed_parking) input.max_cars_allowed_parking = Number(query.max_cars_allowed_parking);

    const dateFields: (keyof SearchInput)[] = ['created_at', 'updated_at', 'approved_at'];
    for (const field of dateFields) {
        if (query[field]) {
            const parsedDate = parseFlexibleDate(query[field] as string);
            if (parsedDate) {
                input[field] = parsedDate.toISOString().split('T')[0];  // פורמט ל-YYYY-MM-DD
            }
        }
    }

    return input;
}

export async function handleUserFilter(req: Request, res: Response) {
    try {

        const input: SearchInput = convertQueryToSearchInput(req);


        const whereClause = buildWhereClauseFromInput(input, getDateRange);


        const lit = buildLiteral('users', whereClause);


        const results = await sequelize.query(
            `
      SELECT
          bu.id AS baseuser_id,
          bu.first_name,
          bu.last_name,
          bu.email,
          u.phone,
          u.status,
          u.department
      FROM baseuser bu
      LEFT JOIN users u ON u.baseuser_id = bu.id
      WHERE ${whereClause}
      `,
            { type: QueryTypes.SELECT }
        );


        res.json({
            whereClause,
            literal: lit.val,
            results
        });
    } catch (error) {
        res.status(400).json({ error: (error as Error).message });
    }
}