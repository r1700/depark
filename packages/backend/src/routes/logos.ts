
import multer from 'multer';
import path from 'path';
import {Logo} from '../model/database-models/logo.model';
import { Router } from 'express';
const router: Router = Router();

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../public/logos'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Route for uploading logo image
// Usage: POST /api/logos/upload with form-data: { logo: <file>, updatedBy: <string> }
router.post('/upload', upload.single('logo'), async (req, res) => {
  console.log('DEBUG: req.body:', req.body);
  console.log('DEBUG: req.file:', req.file);
  console.log('DEBUG: updatedBy:', req.body.updatedBy);
  try {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    if(req.file.mimetype.startsWith('image/') === false) {
      return res.status(400).json({ error: 'File must be an image' });
    }
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.webp'];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res.status(400).json({ error: 'File extension must be an image type (jpg, png, etc.)' });
    }
    const { updatedBy } = req.body;
    const logoUrl = `/logos/${req.file.filename}`;
    // עדכון או יצירה בטבלה
    const [logo, created] = await Logo.upsert({
      logoUrl,
      updatedBy,
      updatedAt: new Date()
    });
    res.json({ success: true, logo });
  } catch (err: any) {
    res.status(500).json({ error: 'Upload failed', details: err.message });
  }
});


// יצירת/עדכון לוגו
router.post('/', async (req, res) => {
  const { logoUrl, updatedBy } = req.body;
  if (!logoUrl) {
    return res.status(400).json({ error: 'Missing logoUrl' });
  }

  
  // עדכון אם קיים, יצירה אם לא
  const [logo, created] = await Logo.upsert({
    logoUrl,
    updatedBy,
    updatedAt: new Date()
  });
  res.json({ success: true, logo });
});

// שליפת לוגו לפי id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const logo = await Logo.findOne({ where: { id } });
  if (!logo) {
    return res.status(404).json({ error: 'Logo not found' });
  }
  res.json({ success: true, logo });
});

// שליפת כל הלוגואים
router.get('/', async (req, res) => {
  const logos = await Logo.findAll();
  res.json({ success: true, logos });
});
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, url, logoUrl, updatedBy } = req.body;
    const logo = await Logo.findByPk(id);
    if (!logo) {
      return res.status(404).json({ error: 'Logo not found' });
    }
    logo.name = name;
    logo.url = url;
    if (logoUrl) logo.logoUrl = logoUrl;
    if (updatedBy) logo.updatedBy = updatedBy;
    await logo.save();
    res.json({ success: true, logo });
  } catch (err) {
    console.error('PUT /api/logos/:id error:', err);
    res.status(500).json({ error: 'Failed to update logo', details: (err as Error).message || String(err) });
  }
});

// מחיקת לוגו
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const deleted = await Logo.destroy({ where: { id } });
  if (!deleted) {
    return res.status(404).json({ error: 'Logo not found' });
  }
  res.json({ success: true });
});

export default router;