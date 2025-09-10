import 'reflect-metadata';
import dotenv from 'dotenv';

dotenv.config();
import express from 'express';
import cors from 'cors';
import loggerRoutes from './middlewares/locallLoggerMiddleware';
import healthRoutes from './routes/health';
import passwordRoutes from './routes/user.routes';
import vehicleRoutes from './routes/vehicle';
import exportToCSV from './routes/exportToCSV';
import userGoogleAuthRoutes from './routes/userGoogle-auth';
import Exit from './routes/opc/exit';
import faultsRouter from './routes/opc/faults';
import techniciansRoutes from "./routes/opc/technicians";
import http from 'http';
import { WebSocketServer } from 'ws';
import session from 'express-session';
import adminConfigRouter from './routes/adminConfig';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth';
import importFromCsv from './routes/importFromCsv';
import logoRouter from './routes/logos';
import screenTypeRouter from './routes/screenType';
import './cronJob';
import GoogleAuth from './routes/google-auth';
import vehicle from './routes/vehicleRoute';
import parkingReport from './routes/parkingStat';
import surfaceReport from './routes/surfaceStat';
import userApi from './routes/userApi';
import ResevedParking from './routes/reservedparkingApi';
import retrieveRoute from './routes/RetrivalQueue';
import otpRoutes from './routes/otp.server';
import routes from './routes/mobile/mobileUserRoutes';
import notifications from "./routes/mobile/notificationsRoutes";
import VehicleModelRouter from './routes/vehicleModel';
import dashboardSatistics from './routes/dashboardStatistics.route';
import { getDashboardSnapshot } from './services/dashboard/dashboardStatistics.service';
import path from 'path';
import feedbackQuestions from './routes/feedbackQuestions';
import feedbackAnswers from './routes/feedbackAnswers';

const app = express();
const server = http.createServer(app);
export const wss = new WebSocketServer({ server });

app.use(express.json());

// --- DEBUG: log incoming requests and who sends responses ---
app.use((req, res, next) => {
    console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} body:`, req.body);
    const origJson = res.json.bind(res);
    const origSend = res.send.bind(res);

    res.json = function (body) {
        console.log(`[DEBUG] res.json called for ${req.method} ${req.originalUrl} with body:`, body);
        console.trace();
        return origJson(body);
    };

    res.send = function (body) {
        console.log(`[DEBUG] res.send called for ${req.method} ${req.originalUrl} with body:`, body);
        console.trace();
        return origSend(body);
    };

    next();
});
// --- end DEBUG ---

const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
}

// Middleware for session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        httpOnly: true
    }
}) as unknown as express.RequestHandler);

// CORS configuration
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const corsOptions = {
    origin: CORS_ORIGIN,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization',
        'Cache-Control',
        'X-Requested-With'
    ],
    exposedHeaders: ['set-cookie'],
    optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

if (!GOOGLE_CLIENT_ID) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
}

// Global request logger
app.use((req, res, next) => {
    console.log(`[REQ] ${new Date().toISOString()} ${req.method} ${req.originalUrl} body:`, req.body);
    next();
});

app.use(loggerRoutes);

// API routes
app.use('/api/health', healthRoutes);
app.use('/api/password', passwordRoutes);
app.use('/api/auth', passwordRoutes);
app.use('/api/vehicle', vehicleRoutes);
app.use('/api/exportToCSV', exportToCSV);
app.use('/api', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userApi);
app.use('/api/reservedparking', ResevedParking);
app.use('/api/auth', userGoogleAuthRoutes);
app.use('/api/vehicles', vehicle);
app.use('/api/admin', adminConfigRouter);
app.use('/api/admin', adminConfigRouter);
app.use('/api/parking-stats', parkingReport);
app.use('/api/surface-stats', surfaceReport);
app.use('/api/tablet', retrieveRoute);
app.use('/api/otp', otpRoutes);
app.use("/api", routes);
app.use("/notifications", notifications);
app.use('/api/importFromCsv', importFromCsv);
app.use('/api/unknown-vehicles', VehicleModelRouter);
app.use('/api/HR-statistics', dashboardSatistics);
app.use('/api/logos', logoRouter);
app.use('/api/screentypes', screenTypeRouter);
app.use('/logos', express.static(path.join(process.cwd(), 'public/logos')));
app.use('/api/OAuth', GoogleAuth);
app.use('/api/feedbackQuestions', feedbackQuestions);
app.use('/api/feedbackAnswers', feedbackAnswers);
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`, req.body);
    next();
});

app.use("/api/opc", techniciansRoutes);
app.use('/api/opc', faultsRouter);
app.use('/api/opc', Exit);

// Print registered routes (debug)
function printRoutes() {
    console.log("Registered routes:", app);
    app._router?.stack?.forEach((middleware: any) => {
        if (middleware.route) {
            const methods = Object.keys(middleware.route.methods).join(',').toUpperCase();
            console.log(`${methods} ${middleware.route.path}`);
        } else if (middleware.name === 'router' && middleware.handle && middleware.handle.stack) {
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    const methods = Object.keys(handler.route.methods).join(',').toUpperCase();
                    console.log(`${methods} ${handler.route.path}`);
                }
            });
        }
    });
}

printRoutes();

// Start server
app.get('/', (req, res) => {
    res.json({ message: 'DePark Backend is running!' });
});

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});

server.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 CORS enabled for: ${CORS_ORIGIN}`);
    console.log('✅ APIs ready!');

    console.log('🔗 Available routes:');
    console.log('   GET  /');
    console.log('   GET  /health');
    console.log('   GET  /api/health');
    console.log('   POST /api/password/reset');
    console.log('   GET  /api/vehicle');
    console.log('   GET  /api/exportToCSV');

    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        console.log('🗄️ Database: Supabase configured');
    } else {
        console.log('📝 Database: Using mock data');
    }
    console.log('✅ Password reset API ready!');
    console.log('🔗 Available routes:');
    console.log('   GET  /');
    console.log('   GET  /health');
    console.log('   GET  /api/auth/users');
    console.log('   POST /api/auth/register');
    console.log('   POST /api/auth/login');
    console.log('   GET  /api/admin/config');
    console.log('   PUT  /api/admin/config');

    if (process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY) {
        console.log(':file_cabinet: Initializing database...');
    } else {
        console.log(':memo: Using mock data - Supabase not configured');
    }
});

// WebSocket setup (single instance)

function heartbeat(this: any) {
    (this as any).isAlive = true;
}

wss.on('connection', async (ws) => {
    console.log('WS client connected');
    (ws as any).isAlive = true;
    ws.on('pong', heartbeat);
    try {
        const snapshot = await getDashboardSnapshot();
        ws.send(JSON.stringify({ type: 'update', data: snapshot }));
    } catch (err) {
        console.error('Error sending initial snapshot:', err);
    }
});

setInterval(async () => {
    try {
        const snapshot = await getDashboardSnapshot();
        const message = JSON.stringify({ type: 'update', data: snapshot });
        wss.clients.forEach((client: any) => {
            if (client.readyState === 1) {
                client.send(message);
            }
        });
    } catch (err) {
        console.error('Error broadcasting snapshot:', err);
    }
}, 1000);

setInterval(() => {
    wss.clients.forEach((ws: any) => {
        if (ws.isAlive === false) return ws.terminate();
        ws.isAlive = false;
        ws.ping();
    });
}, 30000);