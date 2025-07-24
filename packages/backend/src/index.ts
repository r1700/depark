import dotenv from 'dotenv';
// Load environment variables
dotenv.config();

import express from 'express';
import cors from 'cors';
import healthRoutes from './routes/health';
import adminUsersRouter from './routes/admin/adminUsers';
import { updateAdminUser, addAdminUser } from './services/adminUsersServices';

const app = express();
const PORT = process.env.PORT;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middleware
app.use(cors({
  origin: CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/health', healthRoutes);
app.use('/admin', adminUsersRouter);
app.put('/adminUsers/:id', async (req, res) => {
  try {
    const id = Number(req.params.id); // המרה למספר
    const updateData = req.body;

    const updatedUser = await updateAdminUser(id, updateData);
    if (!updatedUser) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }
    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת שרת' });
  }
});

app.post('/adminUsers', async (req, res) => {
  try {
    const userData = req.body;  // הנתונים ליצירת המשתמש (passwordHash, role וכו׳)
    const newUser = await addAdminUser(userData);
    res.status(201).json(newUser);  // 201 – Created
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'שגיאת שרת ביצירת משתמש' });
  }
});


app.listen(PORT, async () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
  
  // Initialize database with sample data if using Supabase
  if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
    console.log('🗄️ Initializing database...');
    
  } else {
    console.log('📝 Using mock data - Supabase not configured');
  }
});