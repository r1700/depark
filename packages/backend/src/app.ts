import express from 'express';
import cors from 'cors';

import adminConfigRouter from './routes/admin-config';
import adminUsersRouter from './routes/admin/adminUsers';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('App file started');

app.use('/api/admin', adminConfigRouter);
app.use('admin',adminUsersRouter)

app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use('*', (req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ message: 'Internal server error' });
});

export default app;