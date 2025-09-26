import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import chalk from 'chalk';
import { ConfigService } from '@nestjs/config';
import * as express from 'express';
import * as cookieParser from 'cookie-parser';
import { jwtDecodeMiddleware } from './custom/middlewares/jwtDecode.middleware';
import { loggerMiddleware } from './custom/middlewares/logger.middleware';

const configService = new ConfigService();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    app.setGlobalPrefix('api');
    app.useGlobalPipes(new ValidationPipe());
    app.use(express.json());
    app.use(cookieParser());

    // Middlewares
    app.use(loggerMiddleware());
    app.use(jwtDecodeMiddleware());
    
    const port = configService.get<number>('port') ?? 3000;
    const nodeEnv = configService.get<string>('node_env') ?? 'development';
    const envColor = nodeEnv === 'production' ? chalk.red.underline(nodeEnv) : chalk.blue.underline(nodeEnv)

    await app.listen(port);

    const logger = new Logger('Bootstrap');
    logger.log(`Rest-API server running on http://localhost:${port}/api in ${envColor}`);
    logger.log(`Graphql server running on http://localhost:${port}/graphql in ${envColor}`);
}

bootstrap();
