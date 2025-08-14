import { Op, WhereOptions, FindOptions, literal, Transaction } from 'sequelize';
import sequelize from '../config/database';
import AdminUser from '../models/AdminUser';
import BaseUser from '../models/BaseUser';
import bcrypt from 'bcrypt';

import { Permission, PermissionLabels } from '../enums/permissions';


export function encodePermissions(permissions: string[]): number {
  // קוד פשוט: כל הרשאה מוצאת את המפתח שלה ב-PermissionLabels ומרכיבה מחרוזת
  const digits = permissions.map(p => {
    // מוצאים מפתח לפי הערך
    const found = Object.entries(PermissionLabels).find(([, label]) => label === p);
    return found ? found[0] : '';
  }).filter(d => d !== '');

  // מחברים למחרוזת ואז ממירים למספר
  const permNumberStr = digits.join('');
  return permNumberStr ? Number(permNumberStr) : 0;
}

export function decodePermissions(permNumber: number): string[] {
  if (typeof permNumber !== 'number' || permNumber <= 0) return [];

  // המרת מספר למחרוזת, פירוק לכל ספרה
  const digits = permNumber.toString().split('');

  const permissions: string[] = [];

  for (const digit of digits) {
    const num = Number(digit);
    if (num && PermissionLabels[num]) {
      permissions.push(PermissionLabels[num]);
    }
  }

  return permissions;
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

// עזר קטן לסינון תאריכים במבנה where
export function addDateCondition<T>(
  where: any, // נותן גמישות מלאה, נמנע שגיאות טיפוס פה
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
  const whereAdmin: WhereOptions = {};
  const whereBaseUser: WhereOptions = {};

  if (filters.searchTerm) {
    if (filters.searchTerm.includes('@')) {
      whereBaseUser.email = { [Op.iLike]: `${filters.searchTerm}%` };
    } else {
      whereBaseUser.lastName = { [Op.iLike]: `${filters.searchTerm}%` };
    }
  }

  if (filters.roles && filters.roles.length > 0) {
    whereAdmin.role = { [Op.in]: filters.roles };
  }

  if (filters.lastLoginAfter) {
    addDateCondition(whereAdmin, 'lastLoginAt', Op.gte, filters.lastLoginAfter);
  }

  if (filters.lastLoginBefore) {
    addDateCondition(whereAdmin, 'lastLoginAt', Op.lte, filters.lastLoginBefore);
  }

  // helper מקומי בתוך הפונקציה
  const normalizeDate = (val: any, name: string): Date | undefined => {
    if (val === undefined || val === null) return undefined;
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

    if (from) addDateCondition(whereAdmin, 'createdAt', Op.gte, from);
    if (to) addDateCondition(whereAdmin, 'createdAt', Op.lte, to);
  } else {
    const createdAfter = normalizeDate(filters.createdAfter, 'createdAfter');
    const createdBefore = normalizeDate(filters.createdBefore, 'createdBefore');

    if (createdAfter && createdBefore && createdAfter.getTime() > createdBefore.getTime()) {
      throw new Error('createdAfter must be earlier than or equal to createdBefore');
    }

    if (createdAfter) addDateCondition(whereAdmin, 'createdAt', Op.gte, createdAfter);
    if (createdBefore) addDateCondition(whereAdmin, 'createdAt', Op.lte, createdBefore);
  }
  
  if (filters.updatedAfter) {
    addDateCondition(whereAdmin, 'updatedAt', Op.gte, filters.updatedAfter);
  }
  if (filters.updatedBefore) {
    addDateCondition(whereAdmin, 'updatedAt', Op.lte, filters.updatedBefore);
  }

  if (filters.activeLastNDays && filters.activeLastNDays > 0) {
    const fromDate = new Date();
    fromDate.setDate(fromDate.getDate() - filters.activeLastNDays);
    addDateCondition(whereAdmin, 'lastLoginAt', Op.gte, fromDate);
  }

  let whereFinal: WhereOptions = whereAdmin;

  if (filters.permissionsInclude && filters.permissionsInclude.length > 0) {
    const encodedPerm = encodePermissions(filters.permissionsInclude);
    whereFinal = {
      [Op.and]: [
        whereAdmin,
        literal(`"AdminUser"."permissions" & ${encodedPerm} = ${encodedPerm}`)
      ]
    };
  }

  const orderBy = filters.sortBy || 'createdAt';
  const orderDir = filters.sortDirection?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

  const limit = filters.limit && filters.limit > 0 ? filters.limit : 100;
  const offset = filters.offset && filters.offset >= 0 ? filters.offset : 0;

  const baseUserAttrs = ['email', 'firstName', 'lastName'];

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
    attributes: ['id', 'role', 'lastLoginAt', 'createdAt', 'updatedAt', 'permissions'],
  };

  const results = await AdminUser.findAll(findOptions);

  return results.map(u => {
    const user = u.toJSON() as any;
    user.permissions = decodePermissions(user.permissions);
    return user;
  });
}
interface UpdateAdminUserData {
  idNumber?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  passwordHash?: string;
  role?: 'admin' | 'hr'; // בהתאם לenum הקיים שלך
  permissions?: string[]; // מערך הרשאות
  lastLoginAt?: Date | null;
  // הוסיפי שדות נוספים במידת הצורך
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

export async function getAdminUserById(
  id: number,
  options?: { transaction?: Transaction }
): Promise<any> {
  const adminUser = await AdminUser.findByPk(id, {
    include: [{ model: BaseUser, as: 'baseUser' }],
    transaction: options?.transaction,  // כאן המשתנה מגיע מ-options
  });

  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  const json = adminUser.toJSON() as any;
  json.permissions = decodePermissions(json.permissions ?? 0);

  delete json.passwordHash;

  return json;
}
export async function updateAdminUser(id: number, data: UpdateAdminUserData): Promise<any> {
  const now = new Date();

  // מוצא את ה-AdminUser על פי המזהה שלו
  const adminUser = await AdminUser.findByPk(id);
  if (!adminUser) throw new Error(`AdminUser with id ${id} not found`);

  // מוצא את ה-BaseUser המקושר אליו
  const baseUser = await BaseUser.findByPk(adminUser.baseUserId);
  if (!baseUser) throw new Error('Associated BaseUser not found');

  // בודק שאין חפיפה עבור idNumber או מייל במשתמשים אחרים (למעט המשתמש הנוכחי)
  await checkUniqueBaseUser(
    data.idNumber ?? baseUser.idNumber,
    data.email ?? baseUser.email,
    baseUser.id
  );

  // ביצוע עדכון טרנזקציוני של שתי הטבלאות
  return sequelize.transaction(async (t) => {
    // עדכון ב-BaseUser
    await baseUser.update(
      {
        idNumber: data.idNumber ?? baseUser.idNumber,
        email: data.email ?? baseUser.email,
        firstName: data.firstName ?? baseUser.firstName,
        lastName: data.lastName ?? baseUser.lastName,
        updatedAt: now,
      },
      { transaction: t }
    );

    // קידוד הרשאות (אם סופקו), אחרת שומר על ההרשאות הקיימות
    const permissionsNumber = data.permissions ? encodePermissions(data.permissions) : adminUser.permissions;

    // עדכון ב-AdminUser
    await adminUser.update(
      {
        passwordHash: data.passwordHash ?? adminUser.passwordHash,
        role: data.role ?? adminUser.role,
        permissions: permissionsNumber,
        lastLoginAt: data.lastLoginAt ?? adminUser.lastLoginAt,
        updatedAt: now,
      },
      { transaction: t }
    );

    // החזרת המידע המעודכן לאחר ביצוע העדכונים
    return getAdminUserById(adminUser.id);
  });
}
interface BaseUserData {
  idNumber: string;
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
  if (!data.idNumber || !data.email) {
    throw new Error("Missing required idNumber or email");
  }
  const now = new Date();

  // לוודא ייחודיות
  await checkUniqueBaseUser(data.idNumber, data.email);

  // חשיפת סיסמא - הצפנה (שנה אלגוריתם במידת הצורך)
  const SALT_ROUNDS = 10;
  const hashedPassword = await bcrypt.hash(data.passwordHash, SALT_ROUNDS);

  return sequelize.transaction(async (t) => {
    const baseUser = await BaseUser.create({
      idNumber: data.idNumber,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      createdAt: now,
      updatedAt: now,
    }, { transaction: t });

    const permissionsNumber = encodePermissions(data.permissions);

    const adminUser = await AdminUser.create({
      baseUserId: baseUser.id,
      passwordHash: hashedPassword,
      role: data.role,
      permissions: permissionsNumber,
      lastLoginAt: data.lastLoginAt ?? null,
      createdAt: now,
      updatedAt: now,
    }, { transaction: t });

    console.log('AdminUser created with id:', adminUser.id);

    // כאן התיקון: מעבירים את הטרנזקציה לפונקציה!
    return getAdminUserById(adminUser.id, { transaction: t });
  });
}