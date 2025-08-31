import { Op, WhereOptions, FindOptions, literal, Transaction } from 'sequelize';
import sequelize from '../config/database';
import AdminUser from '../models/AdminUser';
import BaseUser from '../models/BaseUser';
import bcrypt from 'bcrypt';

import { Permission, PermissionLabels } from '../enums/permissions';
import { Role, RoleLabels } from '../enums/role';


export function getPermissionDigits(values: string[], labels: Record<number, string>): string[] {
  const digits = values
    .map(v => {
      const target = String(v).trim().toLowerCase();
      const found = Object.entries(labels)
        .find(([, label]) => String(label).trim().toLowerCase() === target);
      return found ? found[0] : undefined;
    })
    .filter((d): d is string => !!d);

  return Array.from(new Set(digits)).sort((a, b) => Number(a) - Number(b));
}


export function encodeGeneric(values: string[], labels: Record<number, string>): number {
  const digits = getPermissionDigits(values, labels);
  const numberStr = digits.join('');
  return numberStr ? Number(numberStr) : 0;
}

export function decodeGeneric(value: number, labels: Record<number, string>): string[] {
  if (typeof value !== 'number' || value <= 0) return [];

  const digits = value.toString().split('');
  const result: string[] = [];

  for (const digit of digits) {
    const num = Number(digit);
    if (!isNaN(num) && labels[num]) {
      result.push(labels[num]);
    }
  }

  return result;
}



export interface AdminUserFilters {
  searchTerm?: string;
  roles?: Array<'hr' | 'admin'>;
  permissionsInclude?: string[];
  lastLoginAfter?: Date;
  lastLoginBefore?: Date;
  createdBetween?: { from?: Date; to?: Date };
  createdAfter?: Date;
  createdBefore?: Date;
  updatedAfter?: Date;
  updatedBefore?: Date;
  activeLastNDays?: number;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export function addDateCondition<T>(
  where: any,
  field: keyof T,
  operator: symbol,
  value: Date
) {
  if (!where[field]) {
    where[field] = {};
  }
  where[field][operator] = value;
}


export async function getFilteredAdminUsers(filters: AdminUserFilters) {
  //  Ensure filters is defined to avoid runtime errors
  filters = filters ?? {};

  const whereAdmin: WhereOptions = {};
  const whereBaseUser: WhereOptions = {};
  const whereParts: any[] = [];

  //  Search term
  if (filters.searchTerm) {
    if (filters.searchTerm.includes('@')) {
      whereBaseUser.email = { [Op.iLike]: `${filters.searchTerm}%` };
    } else {
      whereBaseUser.last_name = { [Op.iLike]: `${filters.searchTerm}%` };
    }
  }

  //  Roles filter (preserve existing bitwise behaviour if applicable)
  if (filters.roles && filters.roles.length > 0) {
    const encodedRole = encodeGeneric(filters.roles, RoleLabels);
    whereParts.push(literal(`"AdminUser"."role" & ${encodedRole} = ${encodedRole}`));
  }

  //  Date filters on admin fields
  if (filters.lastLoginAfter) {
    addDateCondition(whereAdmin, 'last_login_at', Op.gte, filters.lastLoginAfter);
  }
  if (filters.lastLoginBefore) {
    addDateCondition(whereAdmin, 'last_login_at', Op.lte, filters.lastLoginBefore);
  }

  const normalizeDate = (val: any, name: string): Date | undefined => {
    //  Treat undefined/null/empty-string as "not provided"
    if (val === undefined || val === null) return undefined;
    if (typeof val === 'string' && val.trim() === '') return undefined;

    if (val instanceof Date) {
      if (isNaN(val.getTime())) throw new Error(`${name} is not a valid date`);
      return val;
    }
    if (typeof val === 'string') {
      const d = new Date(val);
      if (isNaN(d.getTime())) throw new Error(`${name} is not a valid ISO date`);
      return d;
    }
    throw new Error(`${name} must be a Date or an ISO date string`);
  };

  if (filters.createdBetween) {
    const from = normalizeDate(filters.createdBetween.from, 'createdBetween.from');
    const to = normalizeDate(filters.createdBetween.to, 'createdBetween.to');

    if (from && to && from.getTime() > to.getTime()) {
      throw new Error('createdBetween.from must be earlier than or equal to createdBetween.to');
    }

    if (from) addDateCondition(whereBaseUser, 'created_at', Op.gte, from);
    if (to) addDateCondition(whereBaseUser, 'created_at', Op.lte, to);
  } else {
    const createdAfter = normalizeDate(filters.createdAfter, 'createdAfter');
    const createdBefore = normalizeDate(filters.createdBefore, 'createdBefore');

    if (createdAfter && createdBefore && createdAfter.getTime() > createdBefore.getTime()) {
      throw new Error('createdAfter must be earlier than or equal to createdBefore');
    }

    if (createdAfter) addDateCondition(whereBaseUser, 'created_at', Op.gte, createdAfter);
    if (createdBefore) addDateCondition(whereBaseUser, 'created_at', Op.lte, createdBefore);
  }

  if (filters.updatedAfter) {
    addDateCondition(whereBaseUser, 'updated_at', Op.gte, filters.updatedAfter);
  }
  if (filters.updatedBefore) {
    addDateCondition(whereBaseUser, 'updated_at', Op.lte, filters.updatedBefore);
  }

  if (filters.activeLastNDays && filters.activeLastNDays > 0) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - filters.activeLastNDays);
    addDateCondition(whereAdmin, 'last_login_at', Op.gte, fromDate);
  }

  //  Permissions filter (ALL semantics): normalize input, map to digits, require each digit
  if (filters.permissionsInclude && (Array.isArray(filters.permissionsInclude) ? filters.permissionsInclude.length > 0 : String(filters.permissionsInclude).trim() !== '')) {
    const rawPerms = Array.isArray(filters.permissionsInclude)
      ? filters.permissionsInclude
      : [String(filters.permissionsInclude)];

    //  Normalize and map case-insensitively
    const normalized = rawPerms.map(p => String(p).trim().toLowerCase());
    const digits = Array.from(new Set(
      normalized
        .map(n => {
          const found = Object.entries(PermissionLabels)
            .find(([, label]) => String(label).trim().toLowerCase() === n);
          return found ? found[0] : undefined;
        })
        .filter((d): d is string => !!d)
    )).sort((a, b) => Number(a) - Number(b));

    //  Debug log to help diagnose mapping problems (remove in prod)
    // eslint-disable-next-line no-console
    console.log('permissions filter', { rawPerms, normalized, digits });

    if (digits.length === 0) {
      //  No valid permission labels found -> no results (ALL semantics)
      whereParts.push(literal('1 = 0'));
    } else {
      const likeConds = digits.map(d => {
        const safe = String(d).replace(/\D/g, '');
        return `"AdminUser"."permissions"::text LIKE '%${safe}%'`;
      });
      whereParts.push(literal(`(${likeConds.join(' AND ')})`));
    }
  }

  //  include whereAdmin object if populated
  if (Object.keys(whereAdmin).length > 0) {
    whereParts.push(whereAdmin);
  }

  const whereFinal: WhereOptions = whereParts.length > 0 ? { [Op.and]: whereParts } : whereAdmin;

  const orderBy = filters.sortBy ? filters.sortBy.replace(/([A-Z])/g, '_$1').toLowerCase() : 'id';
  const orderDir = filters.sortDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
  const limit = filters.limit && filters.limit > 0 ? filters.limit : 100;
  const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

  const baseUserAttrs = ['email', 'first_name', 'last_name', 'created_at', 'updated_at'];

  const findOptions: FindOptions = {
    where: whereFinal,
    include: [
      {
        model: BaseUser,
        as: 'baseUser',
        where: whereBaseUser,
        required: true,
        attributes: baseUserAttrs,
      },
    ],
    limit,
    offset,
    order: [[orderBy, orderDir]],
    attributes: ['id', 'role', 'last_login_at', 'permissions'],
  };

  const results = await AdminUser.findAll(findOptions);

  return results.map(u => {
    const raw = u.toJSON() as any;
    const role = decodeGeneric(Number(raw.role ?? 0), RoleLabels)[0];
    const permissions = decodeGeneric(Number(raw.permissions ?? 0), PermissionLabels);

    return {
      id: raw.id,
      role,
      permissions,
      lastLoginAt: raw.last_login_at ?? null,
      baseUser: raw.baseUser ? {
        id: raw.baseUser.id,
        email: raw.baseUser.email ?? null,
        firstName: raw.baseUser.first_name ?? null,
        lastName: raw.baseUser.last_name ?? null,
        createdAt: raw.baseUser.created_at ?? null,
        updatedAt: raw.baseUser.updated_at ?? null,
      } : null,
    };
  });
}
interface UpdateAdminUserData {
  email?: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  role?: 'admin' | 'hr';
  permissions?: string[];
  lastLoginAt?: Date | null;
}

export async function checkUniqueBaseUser(
  email: string,
  excludeBaseUserId?: number
): Promise<void> {
  const whereClause: any = {
    email
  };
  if (excludeBaseUserId !== undefined) {
    whereClause.id = { [Op.ne]: excludeBaseUserId };
  }

  const exist = await BaseUser.findOne({ where: whereClause });
  if (exist) throw new Error('User with same email already exists');
}

export async function getAdminUserById(
  id: number,
  options?: { transaction?: Transaction }
): Promise<any> {
  const adminUser = await AdminUser.findByPk(id, {
    include: [{ model: BaseUser, as: 'baseUser' }],
    transaction: options?.transaction,
  });
  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  const json = adminUser.toJSON() as any;
  json.permissions = decodeGeneric(json.permissions ?? 0, PermissionLabels);
  json.role = decodeGeneric(json.role ?? 0, RoleLabels)[0];

  delete json.password_hash;

  return json;
}

export async function updateAdminUser(id: number, data: UpdateAdminUserData): Promise<any> {
  const now = new Date();

  const adminUser = await AdminUser.findByPk(id);
  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  const baseUser = await BaseUser.findByPk(adminUser.baseuser_id);
  if (!baseUser) throw new Error('Associated BaseUser not found');

  await checkUniqueBaseUser(
    data.email ?? baseUser.email,
    baseUser.id
  );

  // קידוד הרשאות (אם סופקו), אחרת שומר על ההרשאות הקיימות
  const permissionsNumber = data.permissions ? encodeGeneric(data.permissions, PermissionLabels) : adminUser.permissions;

  // קידוד role (אם סופק), אחרת שומר על ה-role הקיים
  const roleNumber = data.role ? encodeGeneric([data.role], RoleLabels) : adminUser.role;

  // ביצוע עדכון טרנזקציוני של שתי הטבלאות
  return sequelize.transaction(async (t) => {
    await baseUser.update(
      {
        email: data.email ?? baseUser.email,
        first_name: data.firstName ?? baseUser.first_name,
        last_name: data.lastName ?? baseUser.last_name,
        updated_at: now,
      },
      { transaction: t }
    );

    await adminUser.update(
      {
        password_hash: data.passwordHash ?? adminUser.password_hash,
        role: roleNumber,
        permissions: permissionsNumber,
        last_login_at: data.lastLoginAt ?? adminUser.last_login_at,
      },
      { transaction: t }
    );

    return getAdminUserById(adminUser.id);
  });
}


interface BaseUserData {
  email: string;
  firstName: string;
  lastName: string;
}

interface AdminUserData {
  passwordHash: string;
  role: 'hr' | 'admin';
  permissions: string[];
  lastLoginAt?: Date | null;
}

export async function addAdminUser(data: BaseUserData & AdminUserData): Promise<any> {
  if (!data.email) {
    throw new Error("Missing required email");
  }
  const now = new Date();

  await checkUniqueBaseUser(data.email);

  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(data.passwordHash, SALT_ROUNDS);

  return sequelize.transaction(async (t) => {
    const baseUser = await BaseUser.create({
      email: data.email,
      first_name: data.firstName,
      last_name: data.lastName,
      created_at: now,
      updated_at: now,
    }, { transaction: t });


    const permissionsNumber = encodeGeneric(data.permissions, PermissionLabels);
    const roleNumber = encodeGeneric([data.role], RoleLabels);

    const adminUser = await AdminUser.create({
      baseuser_id: baseUser.id,
      password_hash: hashedPassword,
      role: roleNumber,
      permissions: permissionsNumber,
      last_login_at: data.lastLoginAt ?? null,
    }, { transaction: t });


    console.log('AdminUser created with id:', adminUser.id);

    return getAdminUserById(adminUser.id, { transaction: t });
  });
}