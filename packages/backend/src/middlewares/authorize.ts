// server/middleware/authorize.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export enum Permission {
  Reportes = 1,
  Admin = 2,
  Vehicle = 3,
}

export interface JwtPayloadWithPerms extends jwt.JwtPayload {
  sub?: string;
  name?: string;
  role?: number;
  permissions?: number[];
}

const JWT_SECRET = process.env.JWT_SECRET || 'tziporahhoityuhnvduuuuuplhyrxgbio,mnbvcxz';

function normalizeRequired(required: number | number[]) {
  return Array.isArray(required) ? required : [required];
}

/**
 * authorize(requiredPermissions)
 * - requiredPermissions: number | number[] (Permission enum values)
 * Middleware factory that verifies JWT and checks that the token's permissions
 * include at least one of the requiredPermissions (or role equals Admin etc).
 */
export function authorize(requiredPermissions: number | number[]) {
  const required = normalizeRequired(requiredPermissions);

  return (req: Request, res: Response, next: NextFunction) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Missing Authorization header' });
    }

    const token = auth.slice('Bearer '.length).trim();
    let payload: JwtPayloadWithPerms | null = null;
    try {
      payload = jwt.verify(token, JWT_SECRET) as JwtPayloadWithPerms;
    } catch (err) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    // Attach user info to request for handlers
    (req as any).user = payload;

    const userPerms = new Set<number>((payload.permissions || []).map(Number));
    const userRole = Number(payload.role || 0);

    // Simple rule: if userRole === Admin (2), grant everything
    if (userRole === Permission.Admin) {
      return next();
    }

    // If any required permission exists in user's permissions -> ok
    const allowed = required.some((r) => userPerms.has(r));
    if (allowed) return next();

    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  };
}