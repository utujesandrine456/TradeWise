import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { jwtDecodeMiddleware } from './custom/middlewares/jwtDecode.middleware';
import { loggerMiddleware } from './custom/middlewares/logger.middleware';
import { cloudinaryConfig } from './custom/utils/cloudinary.config';


const chalk = require('chalk');

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    app.use(cookieParser());

    // Middlewares
    app.use(loggerMiddleware());
    app.use(jwtDecodeMiddleware());
    
    cloudinaryConfig(configService);

    const port = Number(configService.get<string>('PORT')) || 2009;
    const nodeEnv = configService.get<string>('NODE_ENV') || 'development';
    const envColor = nodeEnv === 'production' ? chalk.red.underline(nodeEnv) : chalk.blue.underline(nodeEnv)

    app.enableCors({ origin: true, credentials: true });
    await app.listen(port);

    const logger = new Logger('Bootstrap');
    logger.log(`Rest-API server running on http://localhost:${port}/api in ${envColor}`);
    logger.log(`Graphql server running on http://localhost:${port}/graphql in ${envColor}`);
}

bootstrap();
