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
import Opc from './routes/opc/router-opc';
import http from 'http';
import { WebSocketServer } from 'ws';
import session from 'express-session';
import adminConfigRouter from './routes/adminConfig';
import userRoutes from './routes/user.routes';
import authRoutes from './routes/auth';
import importFromCsv from './routes/importFromCsv';
import logoRouter from './routes/logos';
import screenTypeRouter from './routes/screenType';
import './cronJob'; // Import the cron job to ensure it runs on server start
import vehicle from './routes/vehicleRoute';
import GoogleAuth from './routes/google-auth';
import parkingReport from './routes/parkingStat';
import surfaceReport from './routes/surfaceStat';
import userApi from './routes/userApi';
import ResevedParking from './routes/reservedparkingApi';
import retrieveRoute from './routes/RetrivalQueue';
import otpRoutes from './routes/otp.server';
import routes from './routes/mobile/mobileUserRoutes';
import notifications from "./routes/mobile/notificationsRoutes"; 
import Retrival from './routes/RetrivalQueue';
import './cronJob'; // Ensure the cron job runs on server start
import  VehicleModelRouter  from './routes/vehicleModel';
import APIvehicle from './routes/APIvehicle';

import path from 'path';
const app = express();
const server = http.createServer(app);
export const wss = new WebSocketServer({ server })
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
    optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));

if (!GOOGLE_CLIENT_ID) {
    throw new Error('Missing GOOGLE_CLIENT_ID');
}


// Global request logger — מדפיס כל בקשה נכנסת
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
app.use('/api/vehicles', vehicle)
app.use('/api/admin', adminConfigRouter);
app.use('/OAuth', GoogleAuth);
app.use('/api/admin', adminConfigRouter);
app.use('/api/parking-stats', parkingReport);
app.use('/api/surface-stats', surfaceReport);
app.use('/api/tablet', retrieveRoute);
app.use('/api/otp', otpRoutes);
app.use("/api", routes);
app.use("/notifications", notifications);
app.use('/api/importFromCsv', importFromCsv);
app.use('/api/opc',Opc)
app.use('/api/unknown-vehicles', VehicleModelRouter);
app.use('/api/vehicles', APIvehicle); // Ensure this route is correctly set up

app.use('/api/logos', logoRouter);
app.use('/api/screentypes', screenTypeRouter);
app.use('/logos', express.static(path.join(process.cwd(), 'public/logos')));

app.use('/api/tablet', Retrival);

// Log all incoming requests
app.use((req, res, next) => {
    console.log(`[${req.method}] ${req.path}`, req.body);
    next();
});

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

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'DePark Backend is running!' });
});

// Health check route
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});

app.listen(PORT, () => {
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
