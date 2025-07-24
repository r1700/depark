import { pool } from '../db';
import { AdminUser } from '../model/adminUser';

// הוספת משתמש אדמין (כולל ולידציה לכל השדות)
export async function addAdminUser(data: any): Promise<AdminUser> {
  // ולידציה לכל השדות כולל BaseUser
  const adminUser = AdminUser.create({
    ...data,
    createdAt: new Date(),
    updatedAt: new Date(),
  });

  // הכנסת ל-BaseUser
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

  // הכנסת ל-AdminUser
  const adminUserQuery = `
    INSERT INTO "AdminUsers"
    ("idNumber", "email", "firstName", "lastName", "createdAt", "updatedAt", "passwordHash", "role", "permissions", "lastLoginAt", "baseUserId")
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
    RETURNING *
  `;
  const adminUserValues = [
    adminUser.idNumber,
    adminUser.email,
    adminUser.firstName,
    adminUser.lastName,
    adminUser.createdAt,
    adminUser.updatedAt,
    adminUser.passwordHash,
    adminUser.role,
    adminUser.permissions,
    adminUser.lastLoginAt ?? null,
    baseUserId,
  ];
  const { rows } = await pool.query(adminUserQuery, adminUserValues);
  return AdminUser.create(rows[0]);
}

// עדכון משתמש אדמין (כולל עדכון שדות בסיסיים)
export async function updateAdminUser(id: number, data: any): Promise<AdminUser> {
  // ולידציה לכל השדות
  const adminUser = AdminUser.create({
    ...data,
    updatedAt: new Date(),
  });

  // עדכון ב-BaseUser
  const baseUserQuery = `
    UPDATE "BaseUser"
    SET "idNumber" = $1, "email" = $2, "firstName" = $3, "lastName" = $4, "updatedAt" = $5
    WHERE id = (SELECT "baseUserId" FROM "AdminUsers" WHERE id = $6)
  `;
  const baseUserValues = [
    adminUser.idNumber,
    adminUser.email,
    adminUser.firstName,
    adminUser.lastName,
    adminUser.updatedAt,
    id,
  ];
  await pool.query(baseUserQuery, baseUserValues);

  // עדכון ב-AdminUser
  const adminUserQuery = `
    UPDATE "AdminUsers"
    SET "idNumber" = $1, "email" = $2, "firstName" = $3, "lastName" = $4, "updatedAt" = $5,
        "passwordHash" = $6, "role" = $7, "permissions" = $8, "lastLoginAt" = $9
    WHERE id = $10
    RETURNING *
  `;
  const adminUserValues = [
    adminUser.idNumber,
    adminUser.email,
    adminUser.firstName,
    adminUser.lastName,
    adminUser.updatedAt,
    adminUser.passwordHash,
    adminUser.role,
    adminUser.permissions,
    adminUser.lastLoginAt ?? null,
    id,
  ];
  const { rows } = await pool.query(adminUserQuery, adminUserValues);
  return AdminUser.create(rows[0]);
}

// מחיקת משתמש אדמין (כולל מחיקת משתמש בסיסי)
export async function deleteAdminUser(id: number): Promise<void> {
  // מחיקת AdminUser
  const getBaseUserIdQuery = `SELECT "baseUserId" FROM "AdminUsers" WHERE id = $1`;
  const baseUserIdResult = await pool.query(getBaseUserIdQuery, [id]);
  const baseUserId = baseUserIdResult.rows[0]?.baseUserId;

  await pool.query(`DELETE FROM "AdminUsers" WHERE id = $1`, [id]);

  // מחיקת BaseUser
  if (baseUserId) {
    await pool.query(`DELETE FROM "BaseUser" WHERE id = $1`, [baseUserId]);
  }
}
export async function getAllAdminUsers(): Promise<AdminUser[]> {
  const query = `SELECT * FROM "AdminUsers"`;
  const { rows } = await pool.query(query);

  // ולידציה לכל משתמש
  return rows.map(row => AdminUser.create(row));
}