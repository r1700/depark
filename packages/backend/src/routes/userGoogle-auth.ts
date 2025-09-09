import express, { Request, Response, Router } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import sequelize from '../config/sequelize';
import { QueryTypes } from 'sequelize';

const router:Router = express.Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const JWT_SECRET = process.env.JWT_SECRET || 'DEFAULT_SECRET';

router.post('/google', async (req: Request, res: Response) => {
  const { token } = req.body;
  console.log('Received token:', token);

  if (!token) return res.status(400).json({ error: 'Token missing' });

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) return res.status(401).json({ error: 'Invalid token' });

    const results = await sequelize.query(
      `SELECT id, email FROM baseuser WHERE email ILIKE :email LIMIT 1`,
      {
        replacements: { email },
        type: QueryTypes.SELECT
      }
    );
    console.log('Query results:', results);


    const user = results.length > 0 ? results[0] : null;
    console.log('User:', user);

    if (!user) {
      return res.status(401).json({ error: 'User is not registered in the system' });
    }

    const appToken = jwt.sign(
      { id: (user as any).id, email: (user as any).email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token: appToken });
  } catch (err) {
    console.error('Google Auth error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/me', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer '))
    return res.status(401).json({ error: 'Missing or invalid token' });

  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ user: decoded });
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
});

export default router;
