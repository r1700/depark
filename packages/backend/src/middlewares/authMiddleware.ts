import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  id?: string;
  email?: string;
  role?: string;
  permissions?: any;
  iat?: number;
  exp?: number;
}

export default function authenticateToken(req: Request & { user?: JwtPayload }, res: Response, next: NextFunction) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) {
    console.error('JWT_SECRET missing - make sure dotenv is loaded before imports');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  const authHeader = req.get('Authorization');
  if (!authHeader) return res.status(401).json({ error: 'Missing Authorization header' });

  const parts = authHeader.trim().split(/\s+/);
  if (parts.length !== 2 || parts[0].toLowerCase() !== 'bearer') {
    return res.status(401).json({ error: 'Invalid Authorization format' });
  }

  const token = parts[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as JwtPayload; // עכשיו TypeScript יודע ש‑JWT_SECRET קיימת
    req.user = payload;
    return next();
  } catch (err: any) {
    console.log('JWT verify error:', err?.message ?? err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}