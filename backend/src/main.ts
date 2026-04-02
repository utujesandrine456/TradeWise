import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import * as compression from 'compression';
import { jwtDecodeMiddleware } from './custom/middlewares/jwtDecode.middleware';
import { loggerMiddleware } from './custom/middlewares/logger.middleware';
import * as path from 'path';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    // Enable WebSocket support
    app.useWebSocketAdapter(new IoAdapter(app));

    app.setGlobalPrefix('api', {
        exclude: [{ path: '/', method: RequestMethod.GET }],
    });
    app.useGlobalPipes(new ValidationPipe());
    app.use(express.json());
    app.use(cookieParser());
    app.enableCors({
        origin: [
            'http://localhost:2016',  // for development
            'http://localhost:2017',  // for development (alternate port)
            'http://localhost:3000', // for production
            'https://tradewise-cyan.vercel.app', // deployed frontend
        ],
        credentials: true,
    });

    // Middlewares
    app.use(compression());
    app.use(loggerMiddleware());
    app.use(jwtDecodeMiddleware());

    const port =  process.env.PORT || configService.get<number>('port') || 3000;
    const nodeEnv = configService.get<string>('node_env') ?? 'development';
    const envColor = nodeEnv === 'production' ? chalk.red.underline(nodeEnv) : chalk.blue.underline(nodeEnv);

    app.use('/favicon.ico', express.static(path.join(__dirname, '..', 'public', 'favicon.ico')));

    await app.listen(port);

    const devUrl = nodeEnv === 'development' ? `http://localhost:${port}` : '';

    const logger = new Logger('Bootstrap');
    logger.log(`Rest-API server running on ${devUrl}/api in ${envColor}`);
    logger.log(`Graphql server running on ${devUrl}/graphql in ${envColor}`);
    logger.log(`WebSocket server running on ${devUrl}/notifications in ${envColor}`);
}

bootstrap();
