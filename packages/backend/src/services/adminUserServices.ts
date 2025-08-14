import { Op, Sequelize, Order } from 'sequelize';
import sequelize from '../config/database';  
import { AdminUser } from '../models/AdminUser';
import BaseUser from '../models/BaseUser';
import UserActivity from '../models/UserActivity';
import { UserSession } from '../models/UserSession';

export enum Permission {
  Reportes = 1,      // 1 << 0
  Admin = 2,         // 1 << 1
  Vehicle = 3,       // 1 << 2
  // הוסף הרשאות נוספות כאן לפי הצורך
}

export const PermissionLabels: { [key: number]: string } = {
  [Permission.Reportes]: 'reportes',
  [Permission.Admin]: 'admin',
  [Permission.Vehicle]: 'vehicle',
};

export function decodePermissions(permNumber: number): string[] {
  if (typeof permNumber !== 'number') return [];
  const permissions: string[] = [];
  for (const key in Permission) {
    if (isNaN(Number(key))) {
      const value = Permission[key as keyof typeof Permission];
      if ((permNumber & value) !== 0) permissions.push(PermissionLabels[value]);
    }
  }
  return permissions;
}

export function encodePermissions(permissions: string[]): number {
  let permNumber = 0;
  for (const perm of permissions) {
    const entry = Object.entries(PermissionLabels).find(([, label]) => label === perm);
    if (entry) permNumber |= Number(entry[0]);
  }
  return permNumber;
}

export async function checkUniqueBaseUser(
  idNumber: string,
  email: string,
  excludeBaseUserId?: number
): Promise<void> {
  const whereClause: any = {
    [Op.or]: [{ idNumber }, { email }]
  };
  if (excludeBaseUserId !== undefined) {
    whereClause.id = { [Op.ne]: excludeBaseUserId };
  }

  const exist = await BaseUser.findOne({ where: whereClause });
  if (exist) throw new Error('User with same idNumber or email already exists');
}

export async function getAdminUserById(id: number): Promise<any> {
  const adminUser = await AdminUser.findByPk(id, {
    include: [{ model: BaseUser, as: 'baseUser' }]
  });

  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  const json = adminUser.toJSON() as any;
  json.permissions = decodePermissions(json.permissions ?? 0);

  delete json.passwordHash; // לא להחזיר סיסמה

  return json;
}

export async function addAdminUser(data: any): Promise<any> {
  const now = new Date();

  await checkUniqueBaseUser(data.idNumber, data.email);

  return sequelize.transaction(async (t) => {
    const baseUser = await BaseUser.create({
      idNumber: data.idNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: now,
      updatedAt: now,
    }, { transaction: t });

    const permissionsNumber = encodePermissions(data.permissions || []);

    const adminUser = await AdminUser.create({
      baseUserId: baseUser.id,
      passwordHash: data.passwordHash,
      role: data.role,
      permissions: permissionsNumber,
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    }, { transaction: t });

    return getAdminUserById(adminUser.id);
  });
}

export async function updateAdminUser(id: number, data: any): Promise<any> {
  const now = new Date();

  const adminUser = await AdminUser.findByPk(id);
  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  const baseUser = await BaseUser.findByPk(adminUser.baseUserId);
  if (!baseUser) throw new Error('Associated BaseUser not found');

  await checkUniqueBaseUser(data.idNumber || baseUser.idNumber, data.email || baseUser.email, baseUser.id);

  return sequelize.transaction(async (t) => {
    await baseUser.update({
      idNumber: data.idNumber ?? baseUser.idNumber,
      email: data.email ?? baseUser.email,
      firstName: data.firstName ?? baseUser.firstName,
      lastName: data.lastName ?? baseUser.lastName,
      updatedAt: now,
    }, { transaction: t });

    const permissionsNumber = data.permissions ? encodePermissions(data.permissions) : adminUser.permissions;

    await adminUser.update({
      passwordHash: data.passwordHash ?? adminUser.passwordHash,
      role: data.role ?? adminUser.role,
      permissions: permissionsNumber,
      lastLoginAt: data.lastLoginAt ?? adminUser.lastLoginAt,
      updatedAt: now,
    }, { transaction: t });

    return getAdminUserById(adminUser.id);
  });
}

export async function deleteAdminUser(id: number): Promise<void> {
  const adminUser = await AdminUser.findByPk(id);
  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  return sequelize.transaction(async (t) => {
    await adminUser.destroy({ transaction: t });
  });
}

interface AdminUserFilters {
  lastNameStartsWith?: string;
  roles?: string[];
  permissionsInclude?: string[];
  lastLoginAfter?: string | Date;
  lastLoginBefore?: string | Date;
  createdAfter?: string | Date;
  createdBefore?: string | Date;
  updatedAfter?: string | Date;
  updatedBefore?: string | Date;
  lastActivityAfter?: string | Date;
  lastActivityBefore?: string | Date;
  activeLastNDays?: number;
  sortBy?: 'lastLoginAt' | 'lastName' | 'createdAt' | 'permissions' | 'lastActivityTimestamp';
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

  const adminUserWhere: any = {};
  if (roles && roles.length > 0) adminUserWhere.role = { [Op.in]: roles };

  if (permissionsInclude && permissionsInclude.length > 0) {
    const permNumber = encodePermissions(permissionsInclude);
    // זה ביטוי ב-Postgres לביטמסק
    adminUserWhere[Op.and] = Sequelize.literal(`"AdminUser"."permissions" & ${permNumber} != 0`);
  }

  if (lastLoginAfter) adminUserWhere.lastLoginAt = { ...(adminUserWhere.lastLoginAt || {}), [Op.gt]: lastLoginAfter };
  if (lastLoginBefore) adminUserWhere.lastLoginAt = { ...(adminUserWhere.lastLoginAt || {}), [Op.lt]: lastLoginBefore };
  if (createdAfter) adminUserWhere.createdAt = { ...(adminUserWhere.createdAt || {}), [Op.gte]: createdAfter };
  if (createdBefore) adminUserWhere.createdAt = { ...(adminUserWhere.createdAt || {}), [Op.lt]: createdBefore };
  if (updatedAfter) adminUserWhere.updatedAt = { ...(adminUserWhere.updatedAt || {}), [Op.gte]: updatedAfter };
  if (updatedBefore) adminUserWhere.updatedAt = { ...(adminUserWhere.updatedAt || {}), [Op.lt]: updatedBefore };

  const baseUserWhere: any = {};
  if (lastNameStartsWith) baseUserWhere.lastName = { [Op.iLike]: `${lastNameStartsWith}%` };

  const lastActivityFilter: any = {};
  if (lastActivityAfter) lastActivityFilter[Op.gte] = lastActivityAfter;
  if (lastActivityBefore) lastActivityFilter[Op.lte] = lastActivityBefore;
  if (activeLastNDays !== undefined && activeLastNDays !== null) {
    const cutoff = new Date(Date.now() - activeLastNDays * 24 * 60 * 60 * 1000);
    lastActivityFilter[Op.gte] = cutoff;
  }

  // חשוב - אל תשתמש ב-separate:true שם
  const include = [
    {
      model: BaseUser,
      as: 'baseUser',
      where: baseUserWhere,
      required: true,
    },
    {
      model: UserSession,
      as: 'activeSession',    // שימי כאן alias חדש ייחודי - לא 'activeSession' אם זה כבר משומש!
      required: false,
      where: { isActive: true, userType: 'admin' },
      // בלי separate
      limit: 1,
      order: [['lastActivity', 'DESC']] as Order,
    },
    {
      model: UserActivity,
      as: 'activities',  // alias מותאם (לא 'recentActivity')
      required: false,
      where: lastActivityFilter,
      // בלי separate
      limit: 1,
      order: [['timestamp', 'DESC']] as Order,
    },
  ];

  // מיון
  const order: Order = [];
  if (sortBy) {
    if (sortBy === 'permissions') {
      // ניתן למיין לפי הפונקציה בתוך השדה permissions (ביטמאסק)
      order.push([Sequelize.literal('"AdminUser"."permissions"'), sortDirection]);
    } else if (sortBy === 'lastName') {
      order.push([{ model: BaseUser, as: 'baseUser' }, 'lastName', sortDirection]);
    } else if (sortBy === 'lastActivityTimestamp') {
      // כדי למיין לפי הפעילות הכי אחרונה, אפשר למיין לפי הtimestamp במודל activities
      order.push([{ model: UserActivity, as: 'activities' }, 'timestamp', sortDirection]);
    } else {
      order.push([sortBy, sortDirection]);
    }
  }

  const users = await AdminUser.findAll({
    where: adminUserWhere,
    include,
    order,
    limit,
    offset,
  });

  return users.map(user => {
    const userJson = user.toJSON() as any;
    delete userJson.passwordHash;

    // המרת permissions ממספר למערך מחרוזות
    userJson.permissions = decodePermissions(userJson.permissions || 0);

    return userJson;
  });
}