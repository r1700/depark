import pool from '../db/pool';
import { AdminUser } from '../model/user/adminUser';

async function checkUniqueBaseUser(
  idNumber: string,
  email: string,
  excludeBaseUserId?: number
): Promise<void> {
  let query = `
    SELECT 1 FROM "BaseUser"
    WHERE ("idNumber" = $1 OR "email" = $2)
  `;
  const params: (string | number)[] = [idNumber, email];

  if (excludeBaseUserId) {
    query += ' AND id <> $3';
    params.push(excludeBaseUserId);
  }

  query += ' LIMIT 1';

  const { rowCount } = await pool.query(query, params);
  if ((rowCount ?? 0) > 0) {
    throw new Error('User with same idNumber or email already exists');
  }
}

async function getAdminUserById(id: number): Promise<AdminUser> {
  const query = `
    SELECT 
      a.id,
      a."baseUserId",
      b."idNumber",
      b."email",
      b."firstName",
      b."lastName",
      a."passwordHash",
      a."role",
      a."permissions",
      a."lastLoginAt",
      a."createdAt",
      a."updatedAt"
    FROM "AdminUsers" a
    JOIN "BaseUser" b ON a."baseUserId" = b.id
    WHERE a.id = $1;
  `;
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) throw new Error(`AdminUser with id ${id} not found`);

  if (typeof rows[0].permissions === 'string') {
    try {
      rows[0].permissions = JSON.parse(rows[0].permissions);
    } catch {
      rows[0].permissions = [];
    }
  }
  const { baseUserId, ...dataWithoutBaseUserId } = rows[0];

  return AdminUser.create(dataWithoutBaseUserId);
}

export async function addAdminUser(data: any): Promise<AdminUser> {
  const now = new Date();
  const adminUser = AdminUser.create({
    ...data,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: now, 
  });

  await checkUniqueBaseUser(adminUser.idNumber, adminUser.email);

  const baseUserQuery = `
    INSERT INTO "BaseUser"
    ("idNumber", "email", "firstName", "lastName", "createdAt", "updatedAt")
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id
  `;
  const baseUserValues = [
    adminUser.idNumber,
    adminUser.email,
    adminUser.firstName,
    adminUser.lastName,
    adminUser.createdAt,
    adminUser.updatedAt,
  ];
  const baseUserResult = await pool.query(baseUserQuery, baseUserValues);
  const baseUserId = baseUserResult.rows[0].id;

  const adminUserQuery = `
    INSERT INTO "AdminUsers" (
      "baseUserId", "passwordHash", "role", "permissions", "lastLoginAt", "createdAt", "updatedAt"
    ) VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING id
  `;
  const adminUserValues = [
    baseUserId,
    adminUser.passwordHash,
    adminUser.role,
    JSON.stringify(adminUser.permissions),
    adminUser.lastLoginAt,
    adminUser.createdAt,
    adminUser.updatedAt,
  ];
  const adminUserResult = await pool.query(adminUserQuery, adminUserValues);
  const newAdminUserId = adminUserResult.rows[0].id;

  return await getAdminUserById(newAdminUserId);
}

export async function updateAdminUser(id: number, data: any): Promise<AdminUser> {
  const updatedAt = new Date();

  // תחילה, קבלת המשתמש הקיים (כולל כל השדות הדרושים)
  const existingAdminUser = await getAdminUserById(id);

  if (!existingAdminUser) {
    throw new Error(`AdminUser with id ${id} not found`);
  }

  // מיזוג השדות המעודכנים (data) לשדות הקיימים
  const mergedData = {
    ...existingAdminUser,
    ...data,
    updatedAt,        // עדכון שדה זמן העדכון
  };

  const adminUser = AdminUser.create(mergedData);

  // המשך הכתיבה ל-DB (כדוגמה שלך)
  // קודם כל למצוא baseUserId - אם אין אותו ב mergedData, נשאל מה-DB
  const baseUserIdResult = await pool.query(`SELECT "baseUserId" FROM "AdminUsers" WHERE id = $1`, [id]);
  if (baseUserIdResult.rowCount === 0) {
    throw new Error(`AdminUser with id ${id} not found`);
  }
  const baseUserId = baseUserIdResult.rows[0].baseUserId;

  // בדיקת ייחודיות idNumber ו-email
  await checkUniqueBaseUser(adminUser.idNumber, adminUser.email, baseUserId);

  // עדכון טבלת BaseUser
  const baseUserUpdateQuery = `
    UPDATE "BaseUser"
    SET "idNumber"=$1, "email"=$2, "firstName"=$3, "lastName"=$4, "updatedAt"=$5
    WHERE id = $6
  `;
  const baseUserValues = [
    adminUser.idNumber,
    adminUser.email,
    adminUser.firstName,
    adminUser.lastName,
    updatedAt,
    baseUserId,
  ];
  await pool.query(baseUserUpdateQuery, baseUserValues);

  // עדכון טבלת AdminUsers
  const adminUserUpdateQuery = `
    UPDATE "AdminUsers"
    SET "passwordHash"=$1, "role"=$2, "permissions"=$3, "lastLoginAt"=$4, "updatedAt"=$5
    WHERE id = $6
  `;
  const adminUserValues = [
    adminUser.passwordHash,
    adminUser.role,
    JSON.stringify(adminUser.permissions),
    adminUser.lastLoginAt ?? null,
    updatedAt,
    id,
  ];
  const result = await pool.query(adminUserUpdateQuery, adminUserValues);

  if (result.rowCount === 0) {
    throw new Error(`AdminUser with id ${id} not found`);
  }

  return await getAdminUserById(id);
}

export async function deleteAdminUser(id: number): Promise<void> {
  const deleteResult = await pool.query(`DELETE FROM "AdminUsers" WHERE id = $1`, [id]);
  if (deleteResult.rowCount === 0) {
    throw new Error(`AdminUser with id ${id} not found`);
  }
  // מחיקת BaseUser מתבצעת אוטומטית על ידי FK עם ON DELETE CASCADE בבסיס הנתונים
}

interface AdminUserFilters {
  lastNameStartsWith?: string;
  roles?: string[];
  permissionsInclude?: string[];
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;        


  createdAfter?: Date;           
  createdBefore?: Date;           

  updatedAfter?: Date;           
  updatedBefore?: Date;            

  lastActivityAfter?: Date;      
  lastActivityBefore?: Date;    


  activeLastNDays?: number;

  sortBy?: 'lastLoginAt' | 'lastName' | 'createdAt' | 'permissions';
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export async function getFilteredAdminUsers(filters: AdminUserFilters = {}) {
  const {
    lastNameStartsWith,
    roles,
    permissionsInclude,
    lastLoginAfter,
    lastLoginBefore,
    createdAfter,
    createdBefore,
    updatedAfter,
    updatedBefore,
    lastActivityAfter,
    lastActivityBefore,
    activeLastNDays,
    sortBy,
    sortDirection = 'asc',
    limit,
    offset,
  } = filters;

  const selectFields = [
    'a.id',
    'a."baseUserId"',
    'b."idNumber"',
    'b."email"',
    'b."firstName"',
    'b."lastName"',
    'a."passwordHash"',
    'a."role"',
    'a."permissions"',
    'a."lastLoginAt"',
    'a."createdAt"',
    'a."updatedAt"',
    `
    s."id" AS "sessionId",
    s."expiresAt" AS "sessionExpiresAt",
    s."ipAddress" AS "sessionIpAddress",
    s."userAgent" AS "sessionUserAgent",
    s."isActive" AS "sessionIsActive"
    `,
    `
    ua."lastActivityTimestamp",
    ua."lastAction"
    `
  ].join(',\n');

  let baseQuery = `
  SELECT
    ${selectFields}
  FROM "AdminUsers" a
  JOIN "BaseUser" b ON a."baseUserId" = b.id
  LEFT JOIN LATERAL (
    SELECT *
    FROM "UserSessions" us
    WHERE us."userId" = b.id::text
      AND us."userType" = 'admin'
      AND us."isActive" = true
    ORDER BY us."lastActivity" DESC
    LIMIT 1
  ) s ON TRUE
  LEFT JOIN LATERAL (
    SELECT 
      MAX("timestamp") AS "lastActivityTimestamp",
      MAX(CASE WHEN "timestamp" = (
        SELECT MAX("timestamp")
        FROM "UserActivities"
        WHERE "userId" = b.id::text AND "userType" = 'admin'
      ) THEN "action" ELSE NULL END) AS "lastAction"
    FROM "UserActivities" ua
    WHERE ua."userId" = b.id::text AND ua."userType" = 'admin'
  ) ua ON TRUE
  `;

  const whereClauses: string[] = [];
  const params: any[] = [];

  if (lastNameStartsWith) {
    params.push(`${lastNameStartsWith}%`);
    whereClauses.push(`b."lastName" ILIKE $${params.length}`);
  }

  if (roles && roles.length > 0) {
    params.push(roles);
    whereClauses.push(`a."role" = ANY($${params.length})`);
  }

  if (permissionsInclude && permissionsInclude.length > 0) {

    params.push(permissionsInclude);
    whereClauses.push(`a."permissions" ?| $${params.length}`);
  }

  if (lastLoginAfter) {
    params.push(lastLoginAfter);
    whereClauses.push(`a."lastLoginAt" > $${params.length}`);
  }

  if (lastLoginBefore) {
    params.push(lastLoginBefore);
    whereClauses.push(`a."lastLoginAt" < $${params.length}`);
  }

  if (createdAfter) {
    params.push(createdAfter);
    whereClauses.push(`a."createdAt" >= $${params.length}`);
  }
  if (createdBefore) {
    params.push(createdBefore);
    whereClauses.push(`a."createdAt" < $${params.length}`);
  }

  if (updatedAfter) {
    params.push(updatedAfter);
    whereClauses.push(`a."updatedAt" >= $${params.length}`);
  }
  if (updatedBefore) {
    params.push(updatedBefore);
    whereClauses.push(`a."updatedAt" < $${params.length}`);
  }
  if (lastActivityAfter) {
    params.push(lastActivityAfter);
    whereClauses.push(`ua."lastActivityTimestamp" >= $${params.length}`);
  }
  if (lastActivityBefore) {
    params.push(lastActivityBefore);
    whereClauses.push(`ua."lastActivityTimestamp" < $${params.length}`);
  }
  if (activeLastNDays !== undefined && activeLastNDays !== null) {
    const cutOffDate = new Date(Date.now() - activeLastNDays * 24 * 60 * 60 * 1000);
    params.push(cutOffDate);
    whereClauses.push(`ua."lastActivityTimestamp" >= $${params.length}`);
  }
  if (whereClauses.length > 0) {
    baseQuery += ` WHERE ${whereClauses.join(' AND ')}`;
  }

  if (sortBy) {
    if (sortBy === 'permissions') {
      baseQuery += ` ORDER BY jsonb_array_length(a."permissions") ${sortDirection.toUpperCase()}`;
    } else if (sortBy === 'lastName') {
      baseQuery += ` ORDER BY b."lastName" ${sortDirection.toUpperCase()}`;
    } else if (sortBy === 'createdAt' || sortBy === 'lastLoginAt') {
      baseQuery += ` ORDER BY a."${sortBy}" ${sortDirection.toUpperCase()}`;
    }
    else if (sortBy === 'lastActivityTimestamp') {
      baseQuery += ` ORDER BY ua."lastActivityTimestamp" ${sortDirection.toUpperCase()}`;
    }
  }

  if (limit) {
    params.push(limit);
    baseQuery += ` LIMIT $${params.length}`;
  }

  if (offset) {
    params.push(offset);
    baseQuery += ` OFFSET $${params.length}`;
  }

  const { rows } = await pool.query(baseQuery, params);
  console.log(filters.limit)
  return rows.map(row => {
    if (typeof row.permissions === 'string') {
      try {
        row.permissions = JSON.parse(row.permissions);
      } catch {
        row.permissions = [];
      }
    }

    const {
      baseUserId,
      passwordHash,
      sessionId, 
      sessionExpiresAt,
      sessionIpAddress,
      sessionUserAgent,
      sessionIsActive,
      lastActivityTimestamp,
      lastAction,
      ...adminUserData 
    } = row;

    const adminUser = AdminUser.create({
      ...adminUserData,
      passwordHash,
    });

    const { passwordHash: _, ...adminUserFullWithoutPassword } = adminUser;

    const {
      createdAt,
      updatedAt,
      idNumber,
      lastLoginAt,
      id,
      ...adminUserWithoutFilteredFields
    } = adminUserFullWithoutPassword;

    return {
      adminUser: adminUserWithoutFilteredFields,
      lastUserActivity: lastActivityTimestamp ? {
        lastActivityTimestamp,
        lastAction,
      } : null,
    };
  });
}