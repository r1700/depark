// src/routes/logos.ts
import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Logo } from '../model/database-models/logo.model';

const router = Router();

const uploadDir = path.join(__dirname, '../../public/logos');
fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    cb(null, filename);
  }
});

const upload = multer({ storage });

// פתרון מהיר: קאסט של middleware כדי לעקוף בעיית טיפוסים בין חבילות
const uploadSingle = upload.single('logo') as unknown as any;

// Route for uploading logo image
router.post('/upload', uploadSingle, async (req: any, res: Response) => {
  console.log('DEBUG: req.body:', req.body);
  console.log('DEBUG: req.file:', req.file);
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if (!req.file.mimetype || !req.file.mimetype.startsWith('image/')) {
      return res.status(400).json({ error: 'File must be an image' });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: 'File extension must be an image type (jpg, png, etc.)' });
    }

    const { updatedBy } = req.body || {};
    const logoUrl = `/logos/${req.file.filename}`;

    await Logo.upsert({
      logoUrl,
      updatedBy,
      updatedAt: new Date()
    });

    const logo = await Logo.findOne({ where: { logoUrl } });
    return res.json({ success: true, logo });
  } catch (err: any) {
    console.error('POST /api/logos/upload error:', err);
    return res.status(500).json({ error: 'Upload failed', details: err.message || String(err) });
  }
});

// שאר ה־routes (כמו בקוד המקורי)...
// ... (השאר כמו שהגדרת קודם) ...

export default router;