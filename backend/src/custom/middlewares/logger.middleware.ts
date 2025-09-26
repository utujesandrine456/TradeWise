import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import chalk from 'chalk';

export type TLogger = {
    duration: number;
    method: string;
    url: string;
    host: string;
    clientName: string;
    dataLength: number;
    statusCode: number
}

// Function-based logger middleware
export function loggerMiddleware() {
  const logDir = path.join(process.cwd(), 'log');
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });
  const logFilePath = path.join(logDir, 'request-log.txt');

  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    res.on('finish', () => {
        const duration = Date.now() - start;
        const method = req.method;
        const url = req.url;
        const host = req.host;
        const clientName = req.headers['user-agent'] || 'unknown client';
        const dataLength = req.socket.bytesRead;
        const statusCode = res.statusCode;

        // Console logging with chalk
        console.log(
            `${chalk.blue(method)} ${chalk.green(url)} ` +
            `${chalk.yellow(statusCode.toString())} ${chalk.magenta(duration + 'ms')} ` +
            `${chalk.cyan(dataLength.toString())} bytes ${chalk.gray((req as any).user?.sub || '-')}`
        );

        // File logging
        const logMessage = `
[${new Date().toISOString()}] ${method} ${url} | Status: ${statusCode} | Host: ${host} | Client: ${clientName} | DataLength: ${dataLength} bytes | Duration: ${duration}ms | UserId: ${(req as any).user?.sub || ''}
        `;

        fs.appendFile(logFilePath, logMessage + '\n', (err) => {
            if (err) console.error('Error writing log file', err);
        });
    });

    return next();
  };
}