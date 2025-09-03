import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
console.log('[AuthMiddleware] JWT_SECRET בפועל:', JWT_SECRET);
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  console.log('[AuthMiddleware] Authorization header:', authHeader);

  // אם אין טוקן, נשתמש במשתמש דמו לפיתוח בלבד
  if (!authHeader) {
    console.log('[AuthMiddleware] No token, using mock user for dev/demo');
    (req as any).user = { id: 1, email: 'dev@example.com', firstName: 'דב', lastName: 'משתמש', mock: true };
    return next();
  }

  const token = authHeader.split(' ')[1];
  console.log('[AuthMiddleware] Token:', token);

  if (!token) {
    console.log('[AuthMiddleware] Bearer token malformed');
    return res.status(401).json({ error: 'Missing token' });
  }
    
  // Decode header and payload without verifying
  try {
    const [headerB64, payloadB64] = token.split('.');
    const header = JSON.parse(Buffer.from(headerB64, 'base64').toString('utf8'));
    const payload = JSON.parse(Buffer.from(payloadB64, 'base64').toString('utf8'));
    console.log('[AuthMiddleware] JWT header:', header);
    console.log('[AuthMiddleware] JWT payload:', payload);
  } catch (decodeErr) {
    console.log('[AuthMiddleware] JWT decode error:', (decodeErr as Error).message);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('[AuthMiddleware] JWT verify error:', err.message);
      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // מוסיפים את המשתמש ל-request (כאן נתייחס ל-req כ-any בראוטר)
    console.log('[AuthMiddleware] Decoded JWT user:', user);
    (req as any).user = user;
    console.log('[AuthMiddleware] JWT verified, user:', user);
    next();
  });
};

export default authenticateToken;