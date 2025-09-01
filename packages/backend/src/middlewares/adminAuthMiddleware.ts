// src/middlewares/adminAuthMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_real_secret';

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = (req.headers.authorization || (req.headers as any).Authorization) as string | undefined;
    const token = authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

    if (!token) {
      return res.status(401).json({ message: 'Unauthorized: no token' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as any;
    // אם הטוקן חתום כ־{ user: { ... } } השתמשי ב decoded.user
    req.user = decoded.user ?? decoded;
    return next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized: invalid token' });
  }
};

export const requirePermission = (required: string | number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    const role = user.role;
    const permissions: string[] = user.permissions ?? [];

    const isAdmin =
      role === 'admin' ||
      role === 'ADMIN' ||
      role === 1 ||
      role === '1' ||
      role === 2 ||
      role === '2';

    const requiredStr = String(required).toLowerCase();
    const hasPermission = permissions.some(p => String(p).toLowerCase() === requiredStr);

    if (isAdmin || hasPermission) {
      return next();
    }

    return res.status(403).json({ message: 'Forbidden: insufficient permissions' });
  };
};

export const requireRole = (expectedRole: string | number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return res.status(401).json({ message: 'Unauthorized' });

    if (String(user.role) === String(expectedRole)) return next();

    return res.status(403).json({ message: 'Forbidden: role mismatch' });
  };
};