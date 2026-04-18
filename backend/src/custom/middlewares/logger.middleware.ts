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
}