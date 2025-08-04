import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables"); console.log("hiiiiiiii");

const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  console.log('authenticateToken middleware called');
  
  const authHeader = req.headers['authorization'];
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    console.log('Missing Authorization header');

    return res.status(401).json({ error: 'Missing Authorization header' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    console.log('Bearer token malformed');
    return res.status(401).json({ error: 'Missing token' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('JWT verify error:', err.message);

      return res.status(403).json({ error: 'Invalid or expired token' });
    }

    // מוסיפים את המשתמש ל-request (כאן נתייחס ל-req כ-any בראוטר)
    console.log('Decoded JWT user:', user);

    (req as any).user = user;
    console.log('JWT verified, user:', user);

    next();
  });
};

export default authenticateToken;