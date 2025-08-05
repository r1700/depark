import express from 'express';
import cors from 'cors';

// ייבוא הראוטרים
import adminConfigRouter from './routes/adminConfig';
// ייבוא חיבור מסד נתונים
import { sequelize } from './models/ParkingConfiguration';

const app = express();

// בדיקת חיבור למסד נתונים
sequelize.authenticate()
  .then(() => {
    console.log('✅ Database connection established successfully');
  })
  .catch(err => {
    console.error('❌ Unable to connect to the database:', err);
  });

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// הודעת התחלה
console.log('App file started');

// Routes עיקריים (קיימים)

// API Routes חדשים
app.use('/api/admin', adminConfigRouter);


// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;