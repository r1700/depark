import express from 'express';
import cors from 'cors';

// ייבוא הראוטרים
import adminConfigRouter from './routes/adminConfig';

const app = express();

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


// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

// 404 handler - חייב להיות האחרון!
app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});


export default app;