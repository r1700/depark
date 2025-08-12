import express from 'express';
import cors from 'cors';

<<<<<<< HEAD
// import adminConfigRouter from './routes/admin-config';
=======
import adminConfigRouter from './routes/admin-config';
>>>>>>> 5d60df99940e01ab07afc21fc9ac835e0fbd4c13

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('App file started');


<<<<<<< HEAD
// app.use('/api/admin', adminConfigRouter);
=======
app.use('/api/admin', adminConfigRouter);
>>>>>>> 5d60df99940e01ab07afc21fc9ac835e0fbd4c13


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