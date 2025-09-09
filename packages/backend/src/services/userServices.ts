import { literal } from 'sequelize';
import sequelize from '../config/sequelize';
import { Request, Response } from 'express';
import { QueryTypes } from 'sequelize';

export async function getAllUsersWithBaseuser() {
    const results = await sequelize.query(
        `
    SELECT
      bu.id AS baseuser_id,
      bu.first_name,
      bu.last_name,
      bu.email,
      bu.phone,
      u.id AS id,
      u.status,
      u.department,
      u.employee_id,
      u.google_id,
      u.max_cars_allowed_parking,
      u.created_by,
      u.approved_by,
      u.approved_at
    FROM baseuser bu
    LEFT JOIN users u ON u.baseuser_id = bu.id
    `,
        { type: QueryTypes.SELECT }
    );
    return results;
}

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
    created_by?: string | string[];
    approved_by?: string | string[];
    email?: string;
    phone?: string;
    employee_id?: string;
    max_cars_allowed_parking?: number;
    freeSearch?: string;
    status?: number;
    created_at?: string;
    updated_at?: string;
    approved_at?: string;
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

function buildWhereClauseFromInput(
    input: SearchInput,
    getDateRange: (dateStr: string) => [Date, Date]
): string {
    const conditions: string[] = [];

    if (input.email) {
        const safe = input.email.replace(/'/g, "''");
        conditions.push(`bu.email ILIKE '%${safe}%'`);
    }

    if (input.phone) {
        const safe = input.phone.replace(/'/g, "''");
        conditions.push(`bu.phone ILIKE '%${safe}%'`);
    }

    if (input.department) {
        if (Array.isArray(input.department)) {
            const deps = input.department.map(dep => `'${dep}'`).join(', ');
            conditions.push(`u.department IN (${deps})`);
        } else {
            conditions.push(`u.department ILIKE '%${input.department}%'`);
        }
    }

    if (input.employee_id) {
        const safe = input.employee_id.replace(/'/g, "''");
        conditions.push(`u.employee_id ILIKE '%${safe}%'`);
    }

    if (input.freeSearch) {
        const safe = input.freeSearch.replace(/'/g, "''");
        const likePattern = `%${safe}%`;
        conditions.push(
            `(bu.first_name ILIKE '${likePattern}' OR bu.last_name ILIKE '${likePattern}'` +
            ` OR bu.phone ILIKE '${likePattern}' OR bu.email ILIKE '${likePattern}')`
        );
    }

    if (input.status !== undefined) conditions.push(`u.status = ${input.status}`);
    if (input.max_cars_allowed_parking !== undefined) {
        conditions.push(`u.max_cars_allowed_parking >= ${input.max_cars_allowed_parking}`);
    }
    if (input.created_by) {
        if (Array.isArray(input.created_by)) {
            const vals = input.created_by.map(v => `'${v.replace(/'/g, "''")}'`).join(', ');
            conditions.push(`u.created_by IN (${vals})`);
        } else {
            conditions.push(`u.created_by ILIKE '%${String(input.created_by).replace(/'/g, "''")}%'`);
        }
    }

    if (input.approved_by) {
        if (Array.isArray(input.approved_by)) {
            const vals = input.approved_by.map(v => `'${v.replace(/'/g, "''")}'`).join(', ');
            conditions.push(`u.approved_by IN (${vals})`);
        } else {
            conditions.push(`u.approved_by ILIKE '%${String(input.approved_by).replace(/'/g, "''")}%'`);
        }
    }

    const dateFields: (keyof SearchInput)[] = ['created_at', 'updated_at', 'approved_at'];
    for (const field of dateFields) {
        if (input[field]) {
            try {
                const parsedDate = parseFlexibleDate(input[field] as string);
                const [start, end] = getDateRange(formatDateForSQL(parsedDate));
                const startStr = formatDateForSQL(start);
                const endStr = formatDateForSQL(end);
                conditions.push(`u.${field} BETWEEN '${startStr}' AND '${endStr}'`);
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

    function parseMaybeArray(val: any) {
        if (!val) return undefined;
        if (Array.isArray(val)) return val.filter(v => typeof v === 'string');
        if (typeof val === 'string') {
            if (val.includes(',')) return val.split(',').map(s => s.trim()).filter(Boolean);
            return val;
        }
        return undefined;
    }

    if (query.department) input.department = parseMaybeArray(query.department);
    if (query.created_by) input.created_by = parseMaybeArray(query.created_by);
    if (query.approved_by) input.approved_by = parseMaybeArray(query.approved_by);

    if (query.freeSearch) input.freeSearch = String(query.freeSearch);
    if (query.phone) input.phone = String(query.phone);
    if (query.email) input.email = String(query.email);
    if (query.employee_id) input.employee_id = String(query.employee_id);

    const statusMap: Record<string, number> = {
        pending: 0,
        approved: 1,
        declined: 2,
        suspended: 3,
    };
    if (query.status) {
        const val = String(query.status).toLowerCase();
        input.status = statusMap[val] ?? Number(query.status);
    }

    if (query.max_cars_allowed_parking) {
        input.max_cars_allowed_parking = Number(query.max_cars_allowed_parking);
    }

    const dateFields: (keyof SearchInput)[] = ['created_at', 'updated_at', 'approved_at'];
    for (const field of dateFields) {
        if (query[field]) {
            const parsedDate = parseFlexibleDate(String(query[field]));
            if (parsedDate) {
                input[field] = parsedDate.toISOString().split('T')[0];
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
        u.id AS id,
        bu.phone,
        u.status,
        u.department,
        u.employee_id,
        u.google_id,
        u.max_cars_allowed_parking,
        u.created_by,
        u.approved_by,
        u.approved_at
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
export async function updateUserWithBaseuser(
    id: number,
    user: {
        first_name: string;
        last_name: string;
        email: string;
        phone: string;
        status: string;
        department: string;
        employee_id: string;
        google_id?: string;
        max_cars_allowed_parking?: number;
        created_by?: string;
        approved_by?: string;
        approved_at?: string;
    }
) {
    return await sequelize.transaction(async (t) => {
        const nowIso = new Date().toISOString();

        let approvedAtForDb: string | null = null;
        if (user.approved_at) {
            try {
                const parsed = parseFlexibleDate(String(user.approved_at));
                approvedAtForDb = parsed.toISOString();
            } catch (err) {
                console.warn("Invalid approved_at format:", user.approved_at);
            }
        }

        const baseuserRows = await sequelize.query(
            `
            UPDATE baseuser
            SET first_name = :first_name,
                last_name = :last_name,
                email = :email,
                phone = :phone,
                updated_at = :updated_at
            WHERE id = (
                SELECT baseuser_id FROM users WHERE id = :id
            )
            RETURNING id, first_name, last_name, email, phone, updated_at
            `,
            {
                replacements: {
                    id,
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    updated_at: nowIso,
                },
                type: QueryTypes.UPDATE,
                transaction: t,
            }
        );
        const baseuser = Array.isArray(baseuserRows[0]) ? baseuserRows[0][0] : baseuserRows[0];

        // 2. עדכן users
        const usersRows = await sequelize.query(
            `
            UPDATE users
            SET status = :status,
                department = :department,
                employee_id = :employee_id,
                google_id = :google_id,
                max_cars_allowed_parking = :max_cars_allowed_parking,
                created_by = :created_by,
                approved_by = :approved_by,
                approved_at = :approved_at
            WHERE id = :id
            RETURNING *
            `,
            {
                replacements: {
                    id,
                    status: user.status,
                    department: user.department,
                    employee_id: user.employee_id,
                    google_id: user.google_id ?? null,
                    max_cars_allowed_parking: user.max_cars_allowed_parking ?? null,
                    created_by: user.created_by ?? null,
                    approved_by: user.approved_by ?? null,
                    approved_at: approvedAtForDb,
                },
                type: QueryTypes.UPDATE,
                transaction: t,
            }
        );
        const users = Array.isArray(usersRows[0]) ? usersRows[0][0] : usersRows[0];

        return {
            baseuser,
            user: users,
        };
    });
}


export async function deleteUserAndBaseuser(baseuser_id: number) {
    return await sequelize.transaction(async (t) => {
        await sequelize.query(
            `DELETE FROM users WHERE baseuser_id = :baseuser_id`,
            {
                replacements: { baseuser_id },
                type: QueryTypes.DELETE,
                transaction: t,
            }
        );

        await sequelize.query(
            `DELETE FROM baseuser WHERE id = :baseuser_id`,
            {
                replacements: { baseuser_id },
                type: QueryTypes.DELETE,
                transaction: t,
            }
        );

        return { deletedBaseuserId: baseuser_id };
    });
}



export async function addUser(user: {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    status: string;
    department: string;
    employee_id: string;
    google_id?: string;
    max_cars_allowed_parking?: number;
    created_by?: string;
    approved_by?: string;
    approved_at?: string;
}) {
    return await sequelize.transaction(async (t) => {
        const nowIso = new Date().toISOString();

        let approvedAtForDb: string | null = null;
        if (user.approved_at) {
            try {
                const parsed = parseFlexibleDate(String(user.approved_at));
                approvedAtForDb = parsed.toISOString();
            } catch (err) {
                console.warn("Invalid approved_at format:", user.approved_at);
            }
        }

        const baseuserRows = await sequelize.query(
            `
            INSERT INTO baseuser (
                first_name, last_name, email, phone, created_at, updated_at
            )
            VALUES (
                :first_name, :last_name, :email, :phone, :created_at, :updated_at
            )
            RETURNING id, first_name, last_name, email, phone, created_at, updated_at
            `,
            {
                replacements: {
                    first_name: user.first_name,
                    last_name: user.last_name,
                    email: user.email,
                    phone: user.phone,
                    created_at: nowIso,
                    updated_at: nowIso,
                },
                type: QueryTypes.INSERT,
                transaction: t,
            }
        );

        const baseuser = Array.isArray(baseuserRows[0]) ? baseuserRows[0][0] : baseuserRows[0];
        const baseuser_id = baseuser.id;

        const usersRows = await sequelize.query(
            `
            INSERT INTO users (
                baseuser_id,
                status,
                department,
                employee_id,
                google_id,
                max_cars_allowed_parking,
                created_by,
                approved_by,
                approved_at
            )
            VALUES (
                :baseuser_id,
                :status,
                :department,
                :employee_id,
                :google_id,
                :max_cars_allowed_parking,
                :created_by,
                :approved_by,
                :approved_at
            )
            RETURNING *
            `,
            {
                replacements: {
                    baseuser_id,
                    status: user.status,
                    department: user.department,
                    employee_id: user.employee_id,
                    google_id: user.google_id ?? null,
                    max_cars_allowed_parking: user.max_cars_allowed_parking ?? null,
                    created_by: user.created_by ?? null,
                    approved_by: user.approved_by ?? null,
                    approved_at: approvedAtForDb,
                },
                type: QueryTypes.INSERT,
                transaction: t,
            }
        );

        const users = Array.isArray(usersRows[0]) ? usersRows[0][0] : usersRows[0];

        return {
            baseuser,
            user: users,
        };
    });
}
