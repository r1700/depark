// packages/backend/src/routes/auth.ts
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { validateLoginData } from '../../src/validation/check';
import { getId, getRole } from '../../src/services/db/operation';
const router = Router();
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined in environment variables");
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    validateLoginData(email, password);
    const id = await getId(email);
    if (!id) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    const user = await getRole(id.toString());
    if (!user || !user.password_hash) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    const isPasswordCorrect = await bcrypt.compare(password.trim(), user.password_hash);
    if (!isPasswordCorrect) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        permissions: user.permissions,
      },
      JWT_SECRET,
      { expiresIn: '1h' }
    );
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    return res.status(200).json({
      status: 'success',
      success: true,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.first_name || '',
        lastName: user.last_name || '',
        role: user.role,
        permissions: user.permissions,
      },
      token,
      expiresAt,
    });
  } catch (error: any) {
    console.error('Error during login:', error);
    return res.status(500).json({ status: 'error', message: error.message || 'Internal server error' });
  }
});
export default router;