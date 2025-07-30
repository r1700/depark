import sequelize from '../config/database';
import { Permission, PermissionLabels } from '../enums/permissions';
import { QueryTypes } from 'sequelize';

function permissionStringsToNumbers(permissionStrings: string[]): number[] {
  return permissionStrings
    .map((p) => {
      const key = p.toLowerCase();
      switch (key) {
        case 'reportes': return Permission.Reportes;
        case 'admin': return Permission.Admin;
        case 'vehicle': return Permission.Vehicle;
        default: return null;
      }
    })
    .filter((num): num is number => num !== null);
}

function permissionNumbersToInt(permissionNumbers: number[]): number {
  return permissionNumbers.reduce((acc, digit, index) => {
    const power = 7 - index - 1;
    return acc + digit * Math.pow(10, power);
  }, 0);
}

function intToPermissionNumbers(permInt: number): number[] {
  return permInt.toString().padStart(7, '0').split('').map(Number);
}

function intToPermissionStrings(permInt: number): string[] {
  return intToPermissionNumbers(permInt)
    .filter(n => n !== 0)
    .map(n => PermissionLabels[n])
    .filter((s): s is string => s !== undefined);
}

export async function checkUniqueBaseUser(idNumber: string, email: string, excludeBaseUserId?: number): Promise<void> {
  const replacements: Record<string, unknown> = { idNumber, email };
  let query = `SELECT id FROM "BaseUser" WHERE ("idNumber" = :idNumber OR "email" = :email)`;

  if (excludeBaseUserId !== undefined) {
    query += ' AND id != :excludeBaseUserId';
    replacements.excludeBaseUserId = excludeBaseUserId;
  }

  const existing = await sequelize.query<{ id: number }>(query, {
    replacements,
    type: QueryTypes.SELECT,
  });

  if (existing.length > 0) {
    throw new Error('User with same idNumber or email already exists');
  }
}

export async function addAdminUser(data: any): Promise<any> {
  await checkUniqueBaseUser(data.idNumber, data.email);

  return await sequelize.transaction(async (t) => {
    await sequelize.query(`
      INSERT INTO "BaseUser" ("idNumber", "email", "firstName", "lastName", "createdAt", "updatedAt")
      VALUES (:idNumber, :email, :firstName, :lastName, NOW(), NOW())
    `, {
      replacements: data,
      transaction: t,
      type: QueryTypes.INSERT,
    });

    const baseUserResult = await sequelize.query<{ id: number }>(
      `SELECT id FROM "BaseUser" WHERE "email" = :email`,
      {
        replacements: { email: data.email },
        transaction: t,
        type: QueryTypes.SELECT,
      }
    );

    const baseUserId = baseUserResult[0].id;

    const permissionsInt = permissionNumbersToInt(permissionStringsToNumbers(data.permissions));

    await sequelize.query(`
      INSERT INTO "AdminUsers" ("baseUserId", "passwordHash", "role", "permissions", "lastLoginAt", "createdAt", "updatedAt")
      VALUES (:baseUserId, :passwordHash, :role, :permissions, :lastLoginAt, NOW(), NOW())
    `, {
      replacements: {
        baseUserId,
        passwordHash: data.passwordHash,
        role: data.role,
        permissions: permissionsInt,
        lastLoginAt: data.lastLoginAt || null,
      },
      transaction: t,
      type: QueryTypes.INSERT,
    });

    const adminResult = await sequelize.query<{ id: number }>(`
      SELECT id FROM "AdminUsers" WHERE "baseUserId" = :baseUserId
    `, {
      replacements: { baseUserId },
      transaction: t,
      type: QueryTypes.SELECT,
    });

    const adminUserId = adminResult[0].id;
    console.log('Admin user added:', adminResult);

    return getAdminUserById(adminUserId, t);
  });
}

export async function getAdminUserById(id: number, transaction?: any): Promise<any | null> {
  const result = await sequelize.query<any>(`
    SELECT a.*, b."idNumber", b.email, b."firstName", b."lastName"
    FROM "AdminUsers" a
    JOIN "BaseUser" b ON a."baseUserId" = b.id
    WHERE a.id = :id
  `, {
    replacements: { id },
    transaction,
    type: QueryTypes.SELECT,
  });

  if (result.length === 0) return null;

  const admin = result[0];
  admin.permissions = intToPermissionStrings(admin.permissions);
  return admin;
}

export async function updateAdminUser(id: number, data: any): Promise<any | null> {
  return await sequelize.transaction(async (t) => {
    const adminResult = await sequelize.query<any>(`
      SELECT * FROM "AdminUsers" WHERE id = :id
    `, {
      replacements: { id },
      transaction: t,
      type: QueryTypes.SELECT,
    });

    if (adminResult.length === 0) return null;

    const admin = adminResult[0];
    const baseUserId = admin.baseUserId;

    const baseUserResult = await sequelize.query<any>(`
      SELECT * FROM "BaseUser" WHERE id = :baseUserId
    `, {
      replacements: { baseUserId },
      transaction: t,
      type: QueryTypes.SELECT,
    });

    if (baseUserResult.length === 0) return null;

    const baseUser = baseUserResult[0];

    const mergedBaseUserData = {
      idNumber: data.idNumber || baseUser.idNumber,
      email: data.email || baseUser.email,
      firstName: data.firstName || baseUser.firstName,
      lastName: data.lastName || baseUser.lastName,
    };

    await checkUniqueBaseUser(mergedBaseUserData.idNumber, mergedBaseUserData.email, baseUserId);

    await sequelize.query(`
      UPDATE "BaseUser"
      SET "idNumber" = :idNumber, "email" = :email, "firstName" = :firstName,
          "lastName" = :lastName, "updatedAt" = NOW()
      WHERE id = :id
    `, {
      replacements: { ...mergedBaseUserData, id: baseUserId },
      transaction: t,
      type: QueryTypes.UPDATE,
    });

    const permissionsInt = data.permissions
      ? permissionNumbersToInt(permissionStringsToNumbers(data.permissions))
      : admin.permissions;

    const replacements = {
      id,
      passwordHash: data.passwordHash || admin.passwordHash, // אם אין passwordHash ב־data, השתמש בישן
      role: data.role || admin.role,
      permissions: permissionsInt,
      lastLoginAt: data.lastLoginAt || null,
    };

    await sequelize.query(`
      UPDATE "AdminUsers"
      SET "passwordHash" = :passwordHash, "role" = :role, "permissions" = :permissions,
          "lastLoginAt" = :lastLoginAt, "updatedAt" = NOW()
      WHERE id = :id
    `, {
      replacements,  
      transaction: t,
      type: QueryTypes.UPDATE,
    });
    return getAdminUserById(id);
  });
}

export async function deleteAdminUser(id: number): Promise<void> {
  await sequelize.query(`
    DELETE FROM "AdminUsers" WHERE id = :id
  `, {
    replacements: { id },
    type: QueryTypes.BULKDELETE,
  });
}

export async function getFilteredAdminUsers(filters: any): Promise<any[]> {
  const conditions: string[] = [];
  const params: Record<string, any> = {};

  if (filters.lastNameStartsWith) {
    conditions.push(`b."lastName" ILIKE :lastName`);
    params.lastName = `${filters.lastNameStartsWith}%`;
  }

  if (filters.roles?.length) {
    conditions.push(`a.role IN (:roles)`);
    params.roles = filters.roles;
  }

  if (filters.lastLoginAfter) {
    conditions.push(`a."lastLoginAt" > :lastLoginAfter`);
    params.lastLoginAfter = filters.lastLoginAfter;
  }

  if (filters.lastLoginBefore) {
    conditions.push(`a."lastLoginAt" < :lastLoginBefore`);
    params.lastLoginBefore = filters.lastLoginBefore;
  }

  if (filters.permissionsInclude?.length) {
    const perms = filters.permissionsInclude.map((digit: number, i: number) => {
      const key = `perm_like_${i}`;
      params[key] = `%${digit}%`;
      return `CAST(a.permissions AS TEXT) LIKE :${key}`;
    });
    conditions.push(`(${perms.join(' OR ')})`);
  }

  const whereClause = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const sortField = filters.sortBy === 'lastName' ? 'b."lastName"' : `a."${filters.sortBy || 'id'}"`;
  const sortDir = filters.sortDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const orderClause = `ORDER BY ${sortField} ${sortDir}`;

  params.limit = filters.limit || 50;
  params.offset = filters.offset || 0;

  const result = await sequelize.query<any>(`
    SELECT a.*, b."idNumber", b.email, b."firstName", b."lastName"
    FROM "AdminUsers" a
    JOIN "BaseUser" b ON a."baseUserId" = b.id
    ${whereClause}
    ${orderClause}
    LIMIT :limit OFFSET :offset
  `, {
    replacements: params,
    type: QueryTypes.SELECT,
  });

  return result.map((admin: any) => ({
    ...admin,
    permissions: intToPermissionStrings(admin.permissions),
  }));
}
