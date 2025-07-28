import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


declare global {
    namespace Express {
        interface Request {
            user?: any;
        }
    }
}

const app = express();
const PORT = 5000;

app.use(express.json());

const users: { username: string; password: string }[] = [];

app.post('/register', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ username, password: hashedPassword });
    res.status(201).send('User registered');
});

app.post('/login', async (req: Request, res: Response) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return res.status(401).send('Invalid credentials');
    }

    const token = jwt.sign({ username: user.username }, 'yourSecretKey', { expiresIn: '1h' });
    res.json({ token });
});

const authenticateJWT = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.sendStatus(403);
    }

    jwt.verify(token, 'yourSecretKey', (err: any, user: any) => {
        if (err) {
            return res.sendStatus(403);
        }
        req.user = user;
        next();
    });
};

app.get('/protected', authenticateJWT, (req: Request, res: Response) => {
    res.send('This is a protected route');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
