import { Request, Response, NextFunction } from 'express';

type RequireOptions = {
  mode?: 'any' | 'all';
  allowRoles?: number[]; // roles that bypass permission checks (e.g., Admin=2)
};

export const requirePermission = (required: number | number[], options: RequireOptions = {}) => {
  const reqArr = Array.isArray(required) ? required.map(Number) : [Number(required)];
  const { mode = 'any', allowRoles = [2] } = options;

  return (req: Request, res: Response, next: NextFunction) => {

    const admin = (req as any).adminUser;

    if (!admin) {
      return res.status(401).json({ error: 'Not authenticated' });
    }

    // role override (super-admin)
    if (allowRoles.includes(Number(admin.role))) return next();

    const perms: number[] = (admin.permissions || []).map(Number).filter((n: unknown) => !Number.isNaN(n));

    if (mode === 'all') {
      const ok = reqArr.every(r => perms.includes(r));
      if (!ok) return res.status(403).json({ error: 'Forbidden' });
      return next();
    } else {
      const ok = reqArr.some(r => perms.includes(r));
      if (!ok) return res.status(403).json({ error: 'Forbidden' });
      return next();
    }
  };
};