import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateLoginData } from '../../src/validation/check';
import { getId, getRole } from '../services/db/operation';
import { log } from 'winston';

const password = '1111';
const saltRounds = 10;



const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");

router.post('/', async (req, res) => {
  const { email, password } = req.body;

  try {
    validateLoginData(email, password);

    const id = await getId(email);
    console.log("User ID:", id);

    if (!id) {
      console.log('User not found for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = await getRole(id.toString());
    console.log('User from getRole:', user);

    if (!user || !user.password_hash) {
      console.log('User or password_hash is missing for email:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

console.log('Password from request:', password);
  console.log('Password trimmed:', password.trim());
  console.log('Hash from DB:', user.password_hash);

  const isPasswordCorrect = await bcrypt.compare(password, user.password_hash);
  console.log({password, hash: user.password_hash, isPasswordCorrect});

  console.log('Password correct?', isPasswordCorrect);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, permissions: user.permissions },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour from now
    return res.json({
      message: 'Successfully logged in',
      success: true,
      data:{
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
        permissions: user.permissions,
      },
      token,
      expiresAt,
    },
    });
  } 
  catch (error: any) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export default router;
