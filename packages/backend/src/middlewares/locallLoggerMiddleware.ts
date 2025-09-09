import winston from 'winston';
import path from 'path';
import fs from 'fs';
import express, { Router } from 'express';
import moment from 'moment';

const { combine, timestamp, printf } = winston.format;

// Create a logs folder if it does not exist.
const logsDirectory = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}

// Custom log format
const logFormat = printf(({ timestamp, level, message }) => {
  return `${timestamp} [${level}] - ${message}`;
});

// Create the logger with transports (to file)
const logger = winston.createLogger({
  level: 'info', // Default to log level
  format: combine(
    timestamp({
      format: () => moment().local().format('YYYY-MM-DD HH:mm:ss'),
    }),
    logFormat
  ),
  transports: [ // Error & Information & Combined logs    
    new winston.transports.File({
      filename: path.join(logsDirectory, 'error.log'), level: 'error',
    }),    
    new winston.transports.File({
      filename: path.join(logsDirectory, 'info.log'), level: 'info'
    }),    
    new winston.transports.File({
      filename: path.join(logsDirectory, 'combined.log'),
    }),
  ],
});

const router :Router = express.Router();  // Create router

// Manage the middleware that will write the request details and status
router.use((req, res, next) => {
  const start = Date.now();

  // Create a log message before executing the request
  const logMessage = `Incoming Request: Method: ${req.method} | URL: ${req.originalUrl} | Params: ${JSON.stringify(req.params)} | Query: ${JSON.stringify(req.query)} | Body: ${JSON.stringify(req.body)}`;

  // Register the request before it ends
  logger.info(logMessage);

  // End request, after response status is received
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'error' : 'info';
    const logMessageAfter = `Completed Request: Method: ${req.method} | URL: ${req.originalUrl} | Status: ${res.statusCode} | Duration: ${duration}ms`;

    // Logs that Registered after the request is complete
    logger[logLevel](logMessageAfter);

  });
  next();
}
);
export { logger };
export default router;