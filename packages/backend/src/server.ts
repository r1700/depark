import express from 'express';
import * as dotenv from 'dotenv';
import passwordRoutes from './routes/user.routes';

dotenv.config(); // טוען משתני סביבה
const app = express();

app.use(express.json()); // תומך בבקשות JSON
app.use('/api/password', passwordRoutes);

app.listen(3000, () => console.log('✅ Server running on port 3000'));
