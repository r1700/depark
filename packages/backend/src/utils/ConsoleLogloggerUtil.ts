import { logger } from '../middlewares/locallLoggerMiddleware'; //make sure to import your logger

// generic function instead of "Console.log" , written in info.log file
export function logFunctionCall(funcName: string, params: Record<string, any>): void {
  const logMessage = `Function: ${funcName} | Parameters: ${JSON.stringify(params)}`;
  
  // log with info level to info file
  logger.info(logMessage);
}