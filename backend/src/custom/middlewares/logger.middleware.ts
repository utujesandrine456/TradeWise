<<<<<<< HEAD
import { Request, Response, NextFunction } from 'express';
import chalk from 'chalk';
import { Logger } from '@nestjs/common';

export type TLogger = {
    duration: number;
    method: string;
    url: string;
    host: string;
    clientName: string;
    dataLength: number;
    statusCode: number
}

const logger = new Logger("   REST  ");

// Function-based logger middleware
export function loggerMiddleware() {
  return (req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();

    if (req.path.startsWith('/graphql')) {
      return next();
    }

    res.on('finish', () => {
        const duration = Date.now() - start;
        const method = req.method;
        const url = req.url;
        const host = req.host;
        const clientName = req.headers['user-agent'] || 'unknown client';
        const dataLength = req.socket.bytesRead;
        const statusCode = res.statusCode;

        // Decide log level & label based on status code
        const isError = statusCode >= 400;
        const statusLabel = isError ? chalk.red('ERROR') : chalk.green('OK');

        const statusEmoji = isError ? '🚨' : '✅';
        const methodColor = isError ? chalk.red : chalk.blue;
        const detailedMessage = [
            `${statusEmoji} ${chalk.bold(`[${new Date().toISOString()}]`)} ${methodColor(method)} ${chalk.green(url)} ${chalk.yellow('HTTP ' + statusCode.toString())} ${statusLabel}`,
            `   🏠 Host: ${chalk.cyan(host)} | 👤 Client: ${chalk.yellow(clientName)}`,
            `   📦 Payload: ${chalk.cyan(dataLength.toString())} bytes | ⏱️ ${chalk.magenta(duration + 'ms')}`,
            `   🔐 User: ${chalk.gray((req as any).user?.sub || 'anonymous')}`
        ].join('\n');

        if (isError) {
            logger.error(detailedMessage);
        } else {
            logger.log(detailedMessage);
        }
    });

    return next();
  };
=======
import { Request, Response, NextFunction } from 'express';
import * as path from 'path';
import * as fs from 'fs';

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
  const logDir = path.join(process.cwd(), 'logs');
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

        // Console logging without chalk (avoid ESM import issues)
        console.log(`${method} ${url} ${statusCode} ${duration}ms ${dataLength} bytes ${(req as any).user?.sub || '-'}`);

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
>>>>>>> b1302341834bd59231acc121c6a48c14e71dcc68
}