import { Op, WhereOptions, FindOptions, literal, Transaction } from 'sequelize';
import sequelize from '../config/sequelize';
import AdminUser from '../model/database-models/AdminUser';
import BaseUser from '../model/database-models/BaseUser';
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

function mapBaseUser(raw: any): any {
  if (!raw) return null;
  return {
    id: raw.id,
    email: raw.email ?? null,
    firstName: raw.first_name ?? null,
    lastName: raw.last_name ?? null,
    createdAt: raw.created_at ?? null,
    updatedAt: raw.updated_at ?? null,
  };
}

function mapAdminUser(raw: any): any {
  return {
    id: raw.id,
    role: decodeGeneric(Number(raw.role ?? 0), RoleLabels)[0],
    permissions: decodeGeneric(Number(raw.permissions ?? 0), PermissionLabels),
    lastLoginAt: raw.last_login_at ?? null,
    baseUser: mapBaseUser(raw.baseUser),
  };
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
  filters = filters ?? {};

  const whereAdmin: WhereOptions = {};
  const whereBaseUser: WhereOptions = {};
  const whereParts: any[] = [];

  if (filters.searchTerm) {
    if (filters.searchTerm.includes('@')) {
      whereBaseUser.email = { [Op.iLike]: `${filters.searchTerm}%` };
    } else {
      whereBaseUser.last_name = { [Op.iLike]: `${filters.searchTerm}%` };
    }
  }

  if (filters.roles && filters.roles.length > 0) {
    const encodedRole = encodeGeneric(filters.roles, RoleLabels);
    whereParts.push(literal(`"AdminUser"."role" & ${encodedRole} = ${encodedRole}`));
  }

  if (filters.lastLoginAfter) {
    addDateCondition(whereAdmin, 'last_login_at', Op.gte, filters.lastLoginAfter);
  }
  if (filters.lastLoginBefore) {
    addDateCondition(whereAdmin, 'last_login_at', Op.lte, filters.lastLoginBefore);
  }

  const normalizeDate = (val: any, name: string): Date | undefined => {
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
  if (filters.activeLastNDays !== undefined) {
    if (
      typeof filters.activeLastNDays !== 'number' ||
      filters.activeLastNDays <= 0 ||
      filters.activeLastNDays >= 30
    ) {
      throw new Error('activeLastNDays must be a number greater than 0 and less than 30');
    }
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - filters.activeLastNDays);
    addDateCondition(whereAdmin, 'last_login_at', Op.gte, fromDate);
  }

  if (filters.permissionsInclude && (Array.isArray(filters.permissionsInclude) ? filters.permissionsInclude.length > 0 : String(filters.permissionsInclude).trim() !== '')) {
    const rawPerms = Array.isArray(filters.permissionsInclude)
      ? filters.permissionsInclude
      : [String(filters.permissionsInclude)];

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

    console.log('permissions filter', { rawPerms, normalized, digits });

    if (digits.length === 0) {
      whereParts.push(literal('1 = 0'));
    } else {
      const likeConds = digits.map(d => {
        const safe = String(d).replace(/\D/g, '');
        return `"AdminUser"."permissions"::text LIKE '%${safe}%'`;
      });
      whereParts.push(literal(`(${likeConds.join(' AND ')})`));
    }
  }
  if (Object.keys(whereAdmin).length > 0) {
    whereParts.push(whereAdmin);
  }

  const whereFinal: WhereOptions = whereParts.length > 0 ? { [Op.and]: whereParts } : whereAdmin;
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
    attributes: ['id', 'role', 'last_login_at', 'permissions'],
  };

  const results = await AdminUser.findAll(findOptions);

  return results.map(u => mapAdminUser(u.toJSON()));
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

  const raw = adminUser.toJSON();
  return mapAdminUser(raw);
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
  const permissionsNumber = data.permissions ? encodeGeneric(data.permissions, PermissionLabels) : adminUser.permissions;

  const roleNumber = data.role ? encodeGeneric([data.role], RoleLabels) : adminUser.role;
  console.log('permissions:', data.permissions, 'encoded:', permissionsNumber);

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